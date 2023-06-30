import { GetWishlistProductsQuery } from '@schema';

export const getWishlistProductsParser = (productData: any, variantData: any): GetWishlistProductsQuery => {
    const isConfigurable = (id) => {
        const product = variantData.site.products.edges.find((product) => product.node.entityId === id);

        return product.node.variants.edges[0].node.options.edges.length !== 0;
    };

    const getAllOptions = (product) => {
        const options = [];

        product.node.variants.edges.map((variant: any) =>
            variant.node.options.edges.map((attribute: any) =>
                options.find((at) => at.uid === attribute.node.entityId)
                    ? options
                          .find((at) => at.uid === attribute.node.entityId)
                          .values.find((value) => value.uid === attribute.node.values.edges[0].node.entityId)
                        ? null
                        : options
                              .find((at) => at.uid === attribute.node.entityId)
                              .values.push({
                                  uid: attribute.node.values.edges[0].node.entityId,
                                  default_label: attribute.node.values.edges[0].node.label,
                                  label: attribute.node.values.edges[0].node.label,
                                  store_label: attribute.node.values.edges[0].node.label,
                                  use_default_value: null,
                                  value_index: attribute.node.values.edges[0].node.entityId
                              })
                    : options.push({
                          uid: attribute.node.entityId,
                          attribute_code: attribute.node.displayName,
                          attribute_id: attribute.node.entityId,
                          attribute_id_v2: attribute.node.entityId,
                          label: attribute.node.displayName,
                          values: [
                              {
                                  uid: attribute.node.values.edges[0].node.entityId,
                                  default_label: attribute.node.values.edges[0].node.label,
                                  label: attribute.node.values.edges[0].node.label,
                                  store_label: attribute.node.values.edges[0].node.label,
                                  use_default_value: null,
                                  value_index: attribute.node.values.edges[0].node.entityId
                              }
                          ]
                      })
            )
        );

        return options;
    };

    const getConfigurableItem = (item) => {
        const product = variantData.site.products.edges.find((product) => product.node.entityId === item.product_id);

        return {
            __typename: 'ConfigurableWishlistItem',
            id: item.id,
            configurable_options: [],
            product: {
                __typename: 'ConfigurableProduct',
                uid: item.product_id,
                orParentSku: product.node.sku, // TODO_B2B: In the rest operation there is no sku
                image: {
                    label: product.node.images.edges[0].node.altText,
                    url: product.node.images.edges[0].node.urlOriginal
                },
                name: product.node.name,
                price: {
                    regularPrice: {
                        amount: {
                            currency: product.node.prices.price.currencyCode,
                            value: product.node.prices.price.value
                        }
                    },
                    minimalPrice: {
                        amount: {
                            currency: product.node.prices.priceRange.min.currencyCode,
                            value: product.node.prices.priceRange.min.value
                        }
                    }
                },
                price_range: {
                    maximum_price: {
                        final_price: {
                            currency: product.node.prices.priceRange.max.currencyCode,
                            value: product.node.prices.priceRange.max.value
                        }
                    }
                },
                sku: product.node.sku,
                stock_status: product.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                url_key: product.node.path,
                url_suffix: '',
                configurable_options: getAllOptions(product),
                variants: product.node.variants.edges.map((variant: any) => ({
                    attributes: variant.node.options.edges.map((attribute: any) => ({
                        uid: attribute.node.entityId,
                        code: attribute.node.values.edges[0].node.label, //TODO_B2B: See if there is an equivalent
                        value_index: attribute.node.values.edges[0].node.entityId, //TODO_B2B: See if there is an equivalent
                        label: attribute.node.displayName
                    })),
                    product: {
                        stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                        id: variant.node.id,
                        uid: variant.node.entityId,
                        small_image: {
                            url: variant.node.defaultImage ? variant.node.defaultImage.urlOriginal : ''
                        },
                        thumbnail: {
                            url: product.node.path
                        }
                    }
                }))
            }
        };
    };

    const getSimpleItem = (item) => {
        const product = variantData.site.products.edges.find((product) => product.node.entityId === item.product_id);

        return {
            __typename: 'SimpleWishlistItem',
            id: item.id,
            configurable_options: [],
            product: {
                __typename: 'SimpleProduct',
                uid: item.product_id,
                orParentSku: product.node.sku,
                image: {
                    label: product.node.images.edges[0].node.altText,
                    url: product.node.images.edges[0].node.urlOriginal
                },
                name: product.node.name,
                configurable_options: [{ attribute_id: null, values: [{ value_index: null }] }],
                price: {
                    regularPrice: {
                        amount: {
                            currency: product.node.prices.price.currencyCode,
                            value: product.node.prices.price.value
                        }
                    },
                    minimalPrice: {
                        amount: {
                            currency: product.node.prices.priceRange.min.currencyCode,
                            value: product.node.prices.priceRange.min.value
                        }
                    }
                },
                price_range: {
                    maximum_price: {
                        final_price: {
                            currency: product.node.prices.priceRange.max.currencyCode,
                            value: product.node.prices.priceRange.max.value
                        }
                    }
                },
                custom_attributes:
                    product.node.productOptions.edges.length != 0
                        ? product.node.productOptions.edges
                              .map((option) =>
                                  !option.node.isVariantOption
                                      ? {
                                            selected_attribute_options: {
                                                attribute_option: {
                                                    label: option.node.displayName
                                                }
                                            }
                                        }
                                      : null
                              )
                              .filter((item) => item !== null)
                        : [],
                variants: product.node.variants.edges.map((variant: any) => ({
                    attributes: variant.node.options.edges.map((attribute: any) => ({
                        uid: attribute.node.entityId,
                        code: attribute.node.values.edges[0].node.label, //TODO_B2B: See if there is an equivalent
                        value_index: attribute.node.values.edges[0].node.entityId, //TODO_B2B: See if there is an equivalent
                        label: attribute.node.displayName //TODO_B2B: See if exists
                    })),
                    product: {
                        stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                        id: variant.node.id,
                        uid: variant.node.entityId,
                        small_image: {
                            url: variant.node.defaultImage ? variant.node.defaultImage.urlOriginal : null
                        },
                        thumbnail: {
                            url: product.node.path //añadirlo al graphql
                        }
                    }
                })),
                sku: product.node.sku,
                stock_status: product.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                url_key: product.node.path,
                url_suffix: ''
            }
        };
    };

    return {
        customer: {
            wishlist_v2: {
                id: productData.id,
                items_v2: {
                    items: productData.items.map((item: any) =>
                        isConfigurable(item.product_id) ? getConfigurableItem(item) : getSimpleItem(item)
                    )
                }
            }
        }
    };
};
