import { GraphQLClient, gql } from "graphql-request";
import { useLoaderData, json, redirect, LoaderFunction } from "remix";

const EntryQuery = gql`
  query ($slug: [String!]) {
    entry(sectionId: "1", slug: $slug) {
      id
      title
      uri
    }
  }
`;

export const loader: LoaderFunction = async ({ params, request }) => {
  const endpoint = process.env.CRAFT_ENDPOINT as string;
  const options = {
    headers: {
      Authorization: process.env.CRAFT_GQL_TOKEN as string,
    },
  };

  const { entry } = await new GraphQLClient(endpoint, options).request(
    EntryQuery,
    { slug: params.slug }
  );

  if (!entry) {
    const uri = new URL(request.url).pathname;
    const retourRedirected = new Headers(request.headers).has(
      "retour_redirected"
    );

    // If we have already redirected once and we are about to redirect a second time, then we return with a 404 page to prevent a redirect infinite loop. This will also help us identify bad redirects which should go directly to the location. This is only for internal redirects.
    if (retourRedirected) {
      throw new Response("Not found", {
        status: 404,
      });
    }

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
  }

  return json({
    entry,
  });
};

export default function Index() {
  const { entry } = useLoaderData();

  return (
    <>
      <h1>{entry?.title}</h1>
    </>
  );
}
