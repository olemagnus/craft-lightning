import { LoaderFunction, redirect } from "remix";
import type { MetaFunction } from "remix";
import { gql, GraphQLClient } from "graphql-request";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const uri = new URL(request.url).pathname;

  const endpoint = process.env.CRAFT_ENDPOINT as string;
  const options = {
    headers: {
      Authorization: process.env.CRAFT_GQL_TOKEN as string,
    },
  };

  const RedirectQuery = gql`
    query ($uri: String!) {
      retourResolveRedirect(uri: $uri) {
        redirectDestUrl
        redirectHttpCode
        enabled
      }
    }
  `;

  const { retourResolveRedirect: rrr = null } = await new GraphQLClient(
    endpoint,
    options
  ).request(RedirectQuery, { uri });

  if (rrr?.enabled && rrr?.redirectHttpCode !== 410) {
    return redirect(rrr.redirectDestUrl, {
      status: rrr.redirectHttpCode,
      headers: {
        retour_redirected: "true",
      },
    });
  }

  throw new Response(rrr?.redirectHttpCode === 410 ? "Gone" : "Not found", {
    status: rrr?.redirectHttpCode || 404,
  });
};

export default function NotFound() {
  return null;
}
