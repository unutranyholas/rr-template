import { Form, type LoaderFunctionArgs } from "react-router";
import { Button } from "../components/ui/button";
import { getUser } from "../utils/get-data";

export const loader = async (args: LoaderFunctionArgs) => {
  const user = await getUser(args);

  if (!user) {
    return { user: null };
  }

  return { user };
};

export default function IndexPage({
  loaderData,
}: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  const { user } = loaderData;
  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div>
          {user?.icon && (
            <img
              src={user.icon}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        <div>
          <div>{user?.name}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
        </div>
      </div>
      <Form action="/logout" method="post">
        <Button type={"submit"}>Logout</Button>
      </Form>
    </div>
  );
}
