import { gql } from '@apollo/client';

export const GET_WEBKUL_PAYMENT_CREDIT_SYSTEM_CONFIG = gql`
    query GetCustomerStoreCredit {
        customer {
            storeCredit {
                currencyCode
                value
            }
        }
    }
`;

export default {
    getWebkulPaymentCreditSystemConfigQuery: GET_WEBKUL_PAYMENT_CREDIT_SYSTEM_CONFIG
};
