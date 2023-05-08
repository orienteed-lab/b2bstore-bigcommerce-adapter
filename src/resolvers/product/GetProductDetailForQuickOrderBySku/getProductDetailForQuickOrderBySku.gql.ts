import { gql } from '@apollo/client';

export const GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU = gql`
    query productBySku($sku: String) {
        site {
            search {
                searchProducts(filters: { searchTerm: $sku }) {
                    products {
                        collectionInfo {
                            totalItems
                        }
                        edges {
                            node {
                                entityId
                                id
                                name
                                sku
                                prices {
                                    priceRange {
                                        min {
                                            currencyCode
                                            value
                                        }
                                    }
                                    price {
                                        currencyCode
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getProductDetailForQuickOrderBySkuQuery: GET_PRODUCT_FOR_QUICK_ORDER_BY_SKU
};
