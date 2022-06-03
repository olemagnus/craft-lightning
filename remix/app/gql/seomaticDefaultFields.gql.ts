import { gql } from "graphql-request";

export const seomaticDefaultFields = gql`
  fragment seomaticDefaultFields on Query {
    seo: seomatic(asArray: true, uri: $seoUri, site: $siteHandle) {
      ... on SeomaticType {
        metaTitleContainer
        metaTagContainer
        metaLinkContainer
      }
    }
  }
`;
