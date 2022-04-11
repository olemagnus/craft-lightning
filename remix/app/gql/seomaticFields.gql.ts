import { gql } from "graphql-request";

export const seomaticFields = gql`
  fragment seomaticFields on EntryInterface {
    seo: seomatic(asArray: true, uri: $seo) {
      ... on SeomaticType {
        metaTitleContainer
        metaTagContainer
        metaLinkContainer
      }
    }
  }
`;
