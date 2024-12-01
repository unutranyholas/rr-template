import type { LoaderFunctionArgs } from "react-router";
import { getAuthenticator } from "~/services/auth.server";

export const loader = ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
};
