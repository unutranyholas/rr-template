import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, Outlet } from "react-router";
import { Button } from "../components/ui/button";
import { getUser } from "../utils/get-data";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const user = await getUser(args);
  if (!user) {
    return { user: null };
  }
  return { user };
};

export default function Index({
  loaderData,
}: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  const { user } = loaderData;
  if (!user) {
    return (
      <div className="~p-8/12">
        <Form action="/auth/google" method="post">
          <Button type={"submit"}>Login with Google</Button>
        </Form>
      </div>
    );
  }

  return <Outlet />;
}
