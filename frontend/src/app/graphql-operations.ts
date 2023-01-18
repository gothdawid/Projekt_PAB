import { gql } from "apollo-angular";

export const LOGIN = gql`
  mutation login($id: Int!, $password: String!) {
    login(input: { id: $id, password: $password }) {
      token,
      user {
        id, 
        first_name,
        last_name,
        address,
        city,
        group_id,
        isTeacher
      }
    }
  }`;
  