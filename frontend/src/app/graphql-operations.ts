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

export const GET_GROUPS = gql`
  query allGroups {
    allGroups {
      id,
      name,
      createdAt,
      updatedAt
    }
  }
`;

export const GET_SCHEDULE_BY_GROUP_ID = gql`
  query SchedulesByGroup($groupId: ID!) {
    SchedulesByGroup(group_id: $groupId) {
      id,
      day,
      time,
      subject_id,
      Subject {
        id,
        name,
        createdAt,
        updatedAt,
        teacher_id,
        Teacher {
          id,
          first_name,
          last_name,
          address,
          city,
          group_id,
          createdAt,
          updatedAt,
          isTeacher
        }
      },
      group_id,
      room_id,
      Room {
        id,
        name
      },
      createdAt,
      updatedAt
    }
  }
`;

export const GET_MY_GRADES = gql`
  query MyGrades {
    MyGrades {
      id,
      grade,
      student_id,
      Student {
        id,
        first_name,
        last_name,
        address,
        city,
        group_id,
        createdAt,
        updatedAt,
        isTeacher
      },
      subject_id,
      Subject {
        id,
        name,
        createdAt,
        updatedAt,
        teacher_id,
        Teacher {
          id,
          first_name,
          last_name,
          address,
          city,
          group_id,
          createdAt,
          updatedAt,
          isTeacher
        }
      },
      createdAt,
      updatedAt
    }
  }
`;