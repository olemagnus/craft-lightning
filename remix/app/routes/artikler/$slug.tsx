import { useLoaderData, json, LoaderFunction } from "remix";
import type { MetaFunction } from "remix";
import {
  retourResolveRedirect,
  checkRedirect,
} from "~/utils/retourResolveRedirect";
import type { RetourResolveRedirect } from "~/utils/retourResolveRedirect";
import { gqlCraftClient } from "~/utils/gqlCraftClient";
import { ArticleEntryQuery } from "~/gql/article.gql";
import { parseSEO } from "~/utils/parseSEO";
import { DynamicLinksFunction } from "remix-utils";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { entry } = await gqlCraftClient(request).request(ArticleEntryQuery, {
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

export const meta: MetaFunction = ({ data }: { data: any }) =>
  parseSEO(data?.entry?.seo)?.meta;

const dynamicLinks: DynamicLinksFunction = ({ data }) =>
  parseSEO(data?.entry?.seo)?.links;

export const handle = { dynamicLinks };

export default function Index() {
  const { entry } = useLoaderData();

  return (
    <>
      <h1>{entry?.title}</h1>
    </>
  );
}
