import { gql } from '@apollo/client';

export const GET_PRODUCTS_IN_WISHLISTS = gql`
    query getProductsInWishlists {
    customer {
        wishlists {
            edges {
                node {
                    items {
                        edges {
                            node {
                                product {
                                    name
                                    sku
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
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS
};
