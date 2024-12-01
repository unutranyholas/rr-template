import type { ActionFunctionArgs } from "react-router";
import { getAuthenticator } from "~/services/auth.server";

export const action = ({ context, request }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate("google", request);
};
