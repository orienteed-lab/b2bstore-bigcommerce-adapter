import { gql } from '@apollo/client';

export const GET_USER_ID = gql`
    query getUserId {
        customer {
            email
        }
    }
`;

export default {
    getUserIdQuery: GET_USER_ID
};
