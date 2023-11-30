import { gql } from '@apollo/client';

export const GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY = gql`
    query getProductItemsFilteredByCategory($category:Int!) {
    site {
        settings{
            url{
                vanityUrl
            }
        }
        category(entityId:$category) {
            products {
                edges {
                    node {
                        id
                        entityId
                        name
                        path
                        sku
                        variants {
                            edges {
                                node {
                                    entityId
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
    getProductItemsFilteredByCategoryQuery: GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY
};
