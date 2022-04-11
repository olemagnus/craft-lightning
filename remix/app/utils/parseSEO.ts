import { HtmlLinkDescriptor, HtmlMetaDescriptor } from "remix";

interface ISeoProps {
  metaTitleContainer: string;
  metaTagContainer: string;
  metaLinkContainer: string;
  metaJsonLdContainer: string;
}

export interface ISEO {
  meta: HtmlMetaDescriptor;
  links: HtmlLinkDescriptor[];
}

const filterEmptyValues = (item: any): boolean => item?.length !== 0;

export function parseSEO(seo: ISeoProps): ISEO {
  const { metaTitleContainer, metaLinkContainer, metaTagContainer } = seo;

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

  const parseLinkContainer = (container: string): any =>
    Object.entries(JSON.parse(container))
      .map((x) => x?.[1])
      .filter(filterEmptyValues);

  return {
    links: parseLinkContainer(metaLinkContainer),
    meta: parseMetaContainer(
      metaTagContainer,
      JSON.parse(metaTitleContainer)?.title?.title
    ),
  };
}
