import { gql } from "graphql-request";
import { useLoaderData, json, LoaderFunction } from "remix";
import {
  retourResolveRedirect,
  checkRedirect,
} from "~/utils/retourResolveRedirect";
import type { RetourResolveRedirect } from "~/utils/retourResolveRedirect";
import { gqlCraftClient } from "~/utils/gqlCraftClient";

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
  const { entry } = await gqlCraftClient(request).request(EntryQuery, {
    slug: params.slug,
  });

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
