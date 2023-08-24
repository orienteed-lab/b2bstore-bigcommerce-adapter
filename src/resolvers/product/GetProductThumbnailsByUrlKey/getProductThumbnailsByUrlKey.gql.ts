import { gql } from '@apollo/client';

export const GET_PRODUCT_THUMBNAILS_BY_URL_KEY = gql`
    query getProductThumbnailsByUrlKey($url:String!) {
    site {
        route(path:$url) {
            node {
                ... on Product {
                    id
                    sku
                    images {
                        edges {
                            node {
                                altText
                                url(width:165, height:165)
                            }
                        }
                    }
                    path
                    variants {
                        edges {
                            node {
                                id
                                sku
                                defaultImage {
                                    altText
                                    url(width:165, height:165)
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
    getProductThumbnailsByUrlKeyQuery: GET_PRODUCT_THUMBNAILS_BY_URL_KEY
};
