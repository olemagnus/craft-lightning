import { gql } from "graphql-request";
import { seomaticEntryFields } from "./seomaticEntryFields.gql";

export const ArticleEntryQuery = gql`
  ${seomaticEntryFields}
  query ArticleEntryQuery(
    $uri: [String]
    $seoUri: String
    $siteHandle: String
  ) {
    entry(section: "articles", uri: $uri) {
      ... on articles_default_Entry {
        ...seomaticEntryFields
        title
        id
        uri
      }
    }
  }
`;
