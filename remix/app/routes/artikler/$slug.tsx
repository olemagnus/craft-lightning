import { GraphQLClient, gql } from "graphql-request";
import { useLoaderData, json, LoaderFunction, redirect } from "remix";
import { retourResolveRedirect, checkRedirect } from "~/retourResolveRedirect";
import type { RetourResolveRedirect } from "~/retourResolveRedirect";

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
    const rrr: RetourResolveRedirect = await retourResolveRedirect(
      request,
      uri
    );
    return checkRedirect(rrr);
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
