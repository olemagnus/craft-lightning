import { GraphQLClient, gql } from "graphql-request";
import { useLoaderData, json, Link } from "remix";

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

export const loader = async () => {
  const endpoint = process.env.CRAFT_ENDPOINT as string;
  const options = {
    headers: {
      Authorization: process.env.CRAFT_GQL_TOKEN as string,
    },
  };

  const { entries } = await new GraphQLClient(endpoint, options).request(
    EntriesQuery
  );

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
