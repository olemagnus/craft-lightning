import { useLoaderData, json, Link, LoaderFunction, MetaFunction } from "remix";
import { DynamicLinksFunction } from "remix-utils";
import { ArticleEntriesQuery } from "~/gql/articles.gql";
import { gqlCraftClient } from "~/utils/gqlCraftClient";
import { parseSEO } from "~/utils/parseSEO";

export const loader: LoaderFunction = async ({ request }) => {
  const { entries, seo } = await gqlCraftClient(request).request(
    ArticleEntriesQuery
  );

  return json({
    entries,
    seo,
  });
};

export const meta: MetaFunction = ({ data }: { data: any }) =>
  parseSEO(data?.seo)?.meta;

const dynamicLinks: DynamicLinksFunction = ({ data }) =>
  parseSEO(data?.seo)?.links;

export const handle = { dynamicLinks };

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
