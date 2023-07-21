import { gql } from '@apollo/client';

export const GET_CUSTOMER_INFO = gql`
    query getCustomerInfo {
        customer {
            email
            firstName
            lastName
        }
    }
`;

export default {
    getCustomerInfoQuery: GET_CUSTOMER_INFO
};
