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

export const GET_ALL_MY_MESSAGES = gql`
  query GetAllMyMessages {
    getAllMyMessages {
      id
      receiver_id
      sender_id
      text
      updatedAt
      createdAt
      Receiver {
        first_name
        group_id
        id
        isTeacher
        last_name
      }
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation SendMessage($receiver_id: ID!, $text: String!) {
    sendMessage(input: { receiver_id: $receiver_id, text: $text }) {
      id
    }
  }
`

export const GET_ALL_USERS = gql`
query AllUsers {
  allUsers {
    id
    last_name
    first_name
  }
}
`

export const GET_MY_ACCOUNT = gql`
query getMyAccount {
  getMyAccount {
    Group {
      name
      id
    }
    city
    first_name
    last_name
    id
    address,
    avatar
  }
}
`

export const UPDATE_MY_ACCOUNT = gql`
mutation Mutation($avatar: String!, $city: String!, $address: String!) {
  updateMyAccount(input: { avatar: $avatar, city: $city, address: $address }) {
    id
  }
}
`