import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_FOR_ATC_DIALOG_BY_SKU = gql`
    query getProductDetailForATCDialogBySku($sku: String, $optionValueIds:[OptionValueId!]) {
    site {
        product(sku: $sku) {
            __typename
            name
            entityId
        	id
        	images {
                edges {
                    node {
                        urlOriginal
                        altText
                    }
                }
            }
        	prices {
                priceRange {
                    max {
                        currencyCode
                        value
                    }
                }
                saved {
                    value
                }
            }
            productOptions {
                edges {
                    node {
                        ... on MultipleChoiceOption {
                            entityId
                            displayName
                            values {
                                edges {
                                    node {
                                        label
                                        entityId
                                    }
                                }
                            }
                        }
                    }
                }
            }
            variants(optionValueIds:$optionValueIds) {
                edges {
                    node {
                        defaultImage {
                            altText
                            urlOriginal
                        }
                        entityId
                        id
                        prices {
                            priceRange {
                                max {
                                    currencyCode
                                    value
                                }
                            }
                            saved {
                                value
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
    getProductDetailForAtcDialogBySkuQuery: GET_PRODUCT_DETAIL_FOR_ATC_DIALOG_BY_SKU
};
