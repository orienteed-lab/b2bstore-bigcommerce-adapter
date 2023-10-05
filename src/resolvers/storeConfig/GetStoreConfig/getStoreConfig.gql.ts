import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query getStoreConfig {
        site {
            settings {
                storeName
                contact {
                    email
                    phone
                }
            }
            categoryTree {
                entityId
            }
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
