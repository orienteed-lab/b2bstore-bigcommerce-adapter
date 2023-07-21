import { gql } from '@apollo/client';

export const GET_CUSTOMER_INFO = gql`
    query getCustomerInfo {
        customer {
            email
        }
    }
`;

export default {
    getCustomerInfoQuery: GET_CUSTOMER_INFO
};