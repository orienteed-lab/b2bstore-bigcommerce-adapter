import { GetProductDetailForAtcDialogBySkuQuery } from '@schema';

export const getProductDetailForATCDialogBySkuParser = (data: any): GetProductDetailForAtcDialogBySkuQuery => {
    const product = data.site.product;
    const variant = data.site.product.variants.edges[0].node;
    return {
        products: {
            items: [
                {
                    id: product.entityId,
                    uid: product.id,
                    image: {
                        label: product.images.edges[0].node.altText,
                        url: product.images.edges[0].node.urlOriginal
                    },
                    price_range: {
                        maximum_price: {
                            final_price: {
                                currency: product.prices.priceRange.max.currencyCode,
                                value: product.prices.priceRange.max.value
                            },
                            discount: {
                                amount_off: product.prices.saved ? product.prices.saved.value : 0
                            }
                        }
                    },
                    configurable_options: product.productOptions
                        ? product.productOptions.edges
                              .map((option, index) =>
                                  option.node.__typename === 'MultipleChoiceOption'
                                      ? {
                                            attribute_code: option.node.displayName,
                                            attribute_id: option.node.entityId,
                                            uid: option.node.entityId,
                                            attribute_uid: option.node.entityId,
                                            label: option.node.displayName,
                                            position: index, //TODO_B2B: Check how to get the position
                                            values: option.node.values.edges
                                                ? option.node.values.edges.map((value) => ({
                                                      label: value.node.label,
                                                      uid: value.node.entityId
                                                  }))
                                                : []
                                        }
                                      : null
                              )
                              .filter((ele) => ele !== null)
                        : [],
                    configurable_product_options_selection: {
                        media_gallery: [
                            {
                                label: variant.defaultImage ? variant.defaultImage.altText : product.images.edges[0].node.altText,
                                url: variant.defaultImage ? variant.defaultImage.urlOriginal : product.images.edges[0].node.urlOriginal
                            }
                        ],
                        variant: {
                            id: variant.entityId,
                            uid: variant.id,
                            price_range: {
                                maximum_price: {
                                    final_price: {
                                        currency: variant.prices.priceRange.max.currencyCode,
                                        value: variant.prices.priceRange.max.value
                                    },
                                    discount: {
                                        amount_off: variant.prices.saved ? variant.prices.saved.value : 0
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    };
};
