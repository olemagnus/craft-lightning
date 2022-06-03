import { gql } from "graphql-request";
import { seomaticDefaultFields } from "./seomaticDefaultFields.gql";

export const ArticleEntriesQuery = gql`
  ${seomaticDefaultFields}
  query ArticleEntriesQuery() {
    entries(sectionId: "1", limit: 10) {
      id
      title
      slug
      uri
    }
    ...seomaticDefaultFields
  }
`;
