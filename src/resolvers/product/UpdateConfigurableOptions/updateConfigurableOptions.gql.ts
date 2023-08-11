import { gql } from '@apollo/client';

export const UPDATE_CONFIGURABLE_OPTIONS = gql`
    mutation updateConfigurableOptions($item: UpdateCartLineItemInput!) {
        cart {
            updateCartLineItem(input: $item){
                cart {
                    entityId
                }
            }
        }
    }
`;

export const GET_PRODUCT_ID_BY_SKU = gql`
    query getProductIdBySku($parentSku: String!) {
        site {
            product(sku: $parentSku) {
                entityId
                variants {
                    edges {
                        node {
                            entityId
                            sku
                        }
                    }
                }
            }
        }
    }
`;

export default {
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS,
    getProductIdBySkuQuery: GET_PRODUCT_ID_BY_SKU
};
