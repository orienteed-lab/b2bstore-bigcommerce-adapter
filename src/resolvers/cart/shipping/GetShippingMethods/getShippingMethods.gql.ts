import { gql } from '@apollo/client';

export const GET_CUSTOMER_ID = gql`
    query getCustomerId {
        customer {
            entityId
        }
    }
`;

export default {
    getCustomerIdQuery: GET_CUSTOMER_ID
};
