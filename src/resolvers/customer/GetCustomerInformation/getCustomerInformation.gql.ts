import { gql } from '@apollo/client';

export const GET_CUSTOMER_INFORMATION = gql`
    query getCustomerInformation {
        customer {
            __typename
            entityId
            firstName
            lastName
            email
            taxExemptCategory
        }
    }
`;

export default {
    getCustomerInformationQuery: GET_CUSTOMER_INFORMATION
};
