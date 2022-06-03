import { HtmlLinkDescriptor, HtmlMetaDescriptor } from "remix";
import { domAttrToJsx } from "./domAttrToJsx";

interface ISeoProps {
  metaTitleContainer: string;
  metaTagContainer: string;
  metaLinkContainer: string;
}

type Meta = { [k: string]: any };

export interface ISEO {
  meta: HtmlMetaDescriptor;
  links: HtmlLinkDescriptor[];
}

const filterEmptyValues = (item: any): boolean => item?.length !== 0;

const reactifyObjectKeys = (links: Meta): Meta => {
  let obj = {};

  for (const [key, value] of Object.entries(links)) {
    obj = {
      ...obj,
      [domAttrToJsx(key)]: value,
    };
  }

  return obj;
};

export function parseSEO(seo: ISeoProps): ISEO {
  const metaTitleContainer = seo?.metaTitleContainer ?? "";
  const metaLinkContainer = seo?.metaLinkContainer ?? "";
  const metaTagContainer = seo?.metaTagContainer ?? "";

  const parseMetaContainer = (container: string, title: string) =>
    Object.assign(
      {
        title,
      },
      ...Object.values(JSON.parse(container))
        .filter(filterEmptyValues)
        .map((x: any) => ({
          [x.property || x.name]: [x.content],
        }))
    );

  const parseLinkContainer = (container: string): any[] =>
    Object.values(JSON.parse(container) as HtmlLinkDescriptor[])
      .flat()
      .filter(filterEmptyValues)
      // We could have been done here, except we need to format the keys (in the objects) for React
      .map((x) => reactifyObjectKeys(x));

  return {
    links: parseLinkContainer(metaLinkContainer),
    meta: parseMetaContainer(
      metaTagContainer,
      JSON.parse(metaTitleContainer)?.title?.title
    ),
  };
}
