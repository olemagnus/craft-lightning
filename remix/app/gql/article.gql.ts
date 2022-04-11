import { gql } from "graphql-request";
import { seomaticFields } from "./seomaticFields.gql";

export const ArticleEntryQuery = gql`
  ${seomaticFields}
  query ArticleEntryQuery($uri: [String], $seo: String) {
    entry(section: "articles", uri: $uri) {
      ... on articles_default_Entry {
        ...seomaticFields
        title
        id
        uri
      }
    }
  }
`;
