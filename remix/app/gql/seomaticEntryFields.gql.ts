import { gql } from "graphql-request";

export const seomaticEntryFields = gql`
  fragment seomaticEntryFields on EntryInterface {
    seo: seomatic(asArray: true, uri: $seoUri, site: $siteHandle) {
      ... on SeomaticType {
        metaTitleContainer
        metaTagContainer
        metaLinkContainer
      }
    }
  }
`;
