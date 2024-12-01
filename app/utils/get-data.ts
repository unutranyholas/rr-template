import type { LoaderFunctionArgs } from "react-router";
import { getAuthenticator } from "../services/auth.server";

export const getUser = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return await authenticator.isAuthenticated(request);
};

export type LoadedUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;
