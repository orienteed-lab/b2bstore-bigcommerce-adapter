import { GetProductThumbnailsByUrlKeyQuery } from '@schema';

export const getProductThumbnailsByUrlKeyParser = (data: any): GetProductThumbnailsByUrlKeyQuery => {
    return {
        products: {
            items: data.map((item) =>
                item.variants.edges.length !== 0
                    ? {
                          __typename: 'ConfigurableProduct',
                          uid: item.id,
                          sku: item.sku,
                          thumbnail: {
                              label: item.images.edges[0].node.altText,
                              url: item.images.edges[0].node.url
                          },
                          url_key: item.path.slice(1, -1),
                          variants: item.variants.edges.map((variant) => ({
                              product: {
                                  sku: variant.node.sku,
                                  uid: variant.node.id,
                                  thumbnail: {
                                      label: variant.node.defaultImage ? variant.node.defaultImage.altText : item.images.edges[0].node.altText,
                                      url: variant.node.defaultImage ? variant.node.defaultImage.url : item.images.edges[0].node.url
                                  }
                              }
                          }))
                      }
                    : {
                          __typename: 'SimpleProduct',
                          uid: item.id,
                          sku: item.sku,
                          thumbnail: {
                              label: item.images.edges[0].node.altText,
                              url: item.images.edges[0].node.url
                          },
                          url_key: item.path,
                          variants: []
                      }
            )
        }
    };
};
