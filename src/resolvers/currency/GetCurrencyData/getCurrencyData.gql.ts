import { gql } from '@apollo/client';

export const GET_CURRENCY_DATA = gql`
    query GetCurrencyData {
        site {
            currencies {
                edges {
                    node {
                        code
                        isActive
                    }
                }
            }
        }
    }
`;

export default {
    getCurrencyDataQuery: GET_CURRENCY_DATA
};
