import { gql } from '@apollo/client';

export const GET_IMAGE_BY_SKU = gql`
query imageBySku($productSku: String) {
    site {
        product(sku: $productSku) {
          id
          sku
          defaultImage {
            urlOriginal
          }
          variants {
            edges {
              node {
                id
                sku
                defaultImage {
                  urlOriginal
                }
              }
            }
          }
        }
      }
  }
`;

export default {
    getImageBySkuQuery: GET_IMAGE_BY_SKU
};
