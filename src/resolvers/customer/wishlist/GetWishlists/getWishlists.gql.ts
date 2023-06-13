import { gql } from '@apollo/client';

export const GET_WISHLISTS = gql`
    query getWishlists {
        customer {
            wishlists {
                edges {
                    node {
                        entityId
                        items {
                            edges {
                                node {
                                    entityId
                                    product {
                                        id
                                        entityId
                                    }
                                }
                            }
                        }
                        token
                        name
                        isPublic
                    }
                }
            }
        }
    }
`;

export default {
    getWishlistsQuery: GET_WISHLISTS
};
