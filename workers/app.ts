import { drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";

interface CloudflareEnvironment {
  DB: D1Database;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_BASE_URL: string;
}

declare module "react-router" {
  export interface AppLoadContext {}
}

const requestHandler = createRequestHandler(
  // @ts-expect-error - virtual module provided by React Router at build time
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env) {
    const db = drizzle(env.DB, { schema });
    return DatabaseContext.run(db, () =>
      requestHandler(request, {
        AUTH_SECRET: env.AUTH_SECRET,
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_BASE_URL: env.GOOGLE_CALLBACK_BASE_URL,
      }),
    );
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
