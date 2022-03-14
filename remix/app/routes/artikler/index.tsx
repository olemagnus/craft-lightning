import { gql } from "graphql-request";
import { useLoaderData, json, Link, LoaderFunction } from "remix";
import { gqlCraftClient } from "~/utils/gqlCraftClient";

const EntriesQuery = gql`
  {
    entries(sectionId: "1", limit: 10) {
      id
      title
      slug
      uri
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const { entries } = await gqlCraftClient(request).request(EntriesQuery);

  return json({
    entries,
  });
};

export default function Index() {
  const data = useLoaderData();

  return (
    <>
      {data?.entries?.map((entry: any) => (
        <div key={entry.id}>
          <Link to={`/artikler/${entry.slug}`}>{entry.title}</Link>
        </div>
      ))}
    </>
  );
}
