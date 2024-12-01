import { eq } from "drizzle-orm";
import { type AppLoadContext, createCookieSessionStorage } from "react-router";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { type User, users } from "~/lib/schema";
import { database } from "../../database/context";

let _authenticatedUser: Authenticator<User> | null = null;

export function getAuthenticator(context: AppLoadContext) {
  if (_authenticatedUser === null) {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "_session", // use any name you want here
        sameSite: "lax", // this helps with CSRF
        path: "/", // remember to add this so the cookie will work in all routes
        httpOnly: true, // for security reasons, make this cookie http only
        secrets: [context.AUTH_SECRET as string], // replace this with an actual secret
        secure: import.meta.env.PROD, // enable this in prod only
      },
    });
    _authenticatedUser = new Authenticator<User>(sessionStorage);
    const googleStrategy = new GoogleStrategy(
      {
        clientID: context.GOOGLE_CLIENT_ID as string,
        clientSecret: context.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${context.GOOGLE_CALLBACK_BASE_URL}/auth/google/callback`,
        scope: ["openid", "email", "profile"],
      },
      async ({ accessToken, refreshToken, extraParams, profile }) => {
        const db = database();
        const exitsUser = await db
          .select()
          .from(users)
          .where(eq(users.providerId, profile.id))
          .limit(1);

        const photoUrl = profile.photos?.[0]?.value ?? null;

        if (exitsUser.length === 0) {
          const createUser = await db
            .insert(users)
            .values({
              provider: profile.provider,
              providerId: profile.id,
              name: profile.displayName,
              icon: photoUrl,
            })
            .returning()
            .get();
          return { id: createUser.id, name: createUser.name };
        }

        // Update existing user's photo if it's missing
        if (!exitsUser[0].icon && photoUrl) {
          await db
            .update(users)
            .set({ icon: photoUrl })
            .where(eq(users.id, exitsUser[0].id));
        }

        if (!exitsUser[0].email) {
          await db
            .update(users)
            .set({ email: profile.emails?.[0]?.value ?? null })
            .where(eq(users.id, exitsUser[0].id));
        }

        return {
          id: exitsUser[0].id,
          name: exitsUser[0].name,
          icon: exitsUser[0].icon,
          email: exitsUser[0].email,
        };
      },
    );
    _authenticatedUser.use(googleStrategy);
  }
  return _authenticatedUser;
}
