import { GetProductsDetailsBySearchQuery } from '@schema';

export const getProductsDetailsBySearchParser = (data: any, pageSize): GetProductsDetailsBySearchQuery => {
    return {
        products: {
            items: data.site.search.searchProducts.products.edges.map((item: any) =>
                item.node.productOptions.edges.find((opt) => opt.node.isVariantOption)
                    ? {
                          __typename: 'ConfigurableProduct',
                          name: item.node.name,
                          sku: item.node.sku,
                          uid: item.node.id,
                          id: item.node.entityId,
                          url_key: item.node.path.slice(1, -1),
                          url_suffix: '.html',
                          orParentUrlKey: '',
                          //@ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                          stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                          configurable_options: item.node.productOptions
                              ? item.node.productOptions.edges
                                    .map((option: any) =>
                                        option.node.isVariantOption
                                            ? {
                                                  __typename: 'ConfigurableProductOptions',
                                                  attribute_code: option.node.displayName,
                                                  attribute_id: option.node.entityId,
                                                  uid: option.node.entityId,
                                                  label: option.node.displayName,
                                                  values:
                                                      option.node.values !== undefined
                                                          ? option.node.values.edges.map((value: any) => ({
                                                                __typename: 'ConfigurableProductOptionsValues',
                                                                uid: value.node.entityId,
                                                                default_label: value.node.label,
                                                                label: value.node.label,
                                                                store_label: value.node.label,
                                                                use_default_value: value.node.isDefault,
                                                                value_index: value.node.entityId,
                                                                swatch_data: {
                                                                    // swatch_data: option.node.values.edges.map((swatch: any) => ({
                                                                    //     if (swatch.node.__typename == 'ColorSwatchData'){
                                                                    //         __typename: 'ColorSwatchData',
                                                                    //          value: swatch.node.hexColors
                                                                    //     }
                                                                    //     if (swatch.node.__typename == 'ImageSwatchData'){
                                                                    //     value:  swatch.node.imageUrl,
                                                                    //     thumbnail:
                                                                    //     }
                                                                    //     if (swatch.node.__typename == 'TextSwatchData'){
                                                                    //         value:  swatch.node.imageUrl,
                                                                }
                                                            }))
                                                          : []
                                              }
                                            : null
                                    )
                                    .filter((option: any) => option !== null)
                              : [],
                          variants: item.node.variants
                              ? item.node.variants.edges.map((variant: any) => ({
                                    __typename: 'ConfigurableVariant',
                                    attributes: variant.node.options.edges.map((attribute: any) => ({
                                        __typename: 'ConfigurableAttributeOption',
                                        code: attribute.node.displayName,
                                        value_index: attribute.node.values.edges[0].node.entityId
                                    })),
                                    product: {
                                        __typename: 'SimpleProduct',
                                        name: `${item.node.name} ${variant.node.options.edges.map(
                                            (attribute: any) => attribute.node.values.edges[0].node.label
                                        )}`, //Add variant's parameters in name
                                        sku: variant.node.sku,
                                        uid: variant.node.id,
                                        // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                                        stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                                        description: item.node.description,
                                        categories: item.node.categories.edges.map((category: any) => ({
                                            name: category.name
                                        })),
                                        price: {
                                            regularPrice: {
                                                amount: {
                                                    currency: variant.node.prices.price.currencyCode,
                                                    value: variant.node.prices.price.value
                                                }
                                            },
                                            minimalPrice: {
                                                amount: {
                                                    currency: variant.node.prices.priceRange.min.currencyCode,
                                                    value: variant.node.prices.priceRange.min.value
                                                }
                                            }
                                        },
                                        price_range: {
                                            maximum_price: {
                                                final_price: {
                                                    currency: variant.node.prices.priceRange.max.currencyCode,
                                                    value: variant.node.prices.priceRange.max.value
                                                }
                                            }
                                        }
                                    }
                                }))
                              : [],
                          small_image: {
                              url: item.node.defaultImage.urlOriginal
                          },
                          price: {
                              regularPrice: {
                                  amount: {
                                      currency: item.node.prices.basePrice.currencyCode,
                                      value: item.node.prices.basePrice.value
                                  }
                              },
                              minimalPrice: {
                                  amount: {
                                      currency: item.node.prices.priceRange.min.currencyCode,
                                      value: item.node.prices.priceRange.min.value
                                  }
                              }
                          },
                          price_range: {
                              maximum_price: {
                                  regular_price: {
                                      currency: item.node.prices.priceRange.max.currencyCode,
                                      value: item.node.prices.priceRange.max.value
                                  }
                              }
                          },
                          custom_attributes: item.node.productOptions.edges
                              .map((option: any) =>
                                  !option.node.isVariantOption
                                      ? {
                                            __typename: 'CustomAttribute',
                                            selected_attribute_options: {
                                                __typename: 'SelectedAttributeOption',
                                                attribute_option: [
                                                    {
                                                        __typename: 'AttributeOption',
                                                        label: option.node.displayName
                                                    }
                                                ]
                                            },
                                            attribute_metadata: {
                                                __typename: 'AttributeMetadata',
                                                label: option.node.displayName
                                            }
                                        }
                                      : null
                              )
                              .filter((option: any) => option !== null) // TODO_B2B: Add custom attributes
                      }
                    : {
                          __typename: 'SimpleProduct',
                          name: item.node.name,
                          sku: item.node.sku,
                          uid: item.node.id,
                          id: item.node.entityId,
                          url_key: item.node.path.slice(1, -1),
                          url_suffix: '.html',
                          orParentUrlKey: '',
                          //@ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                          stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                          small_image: {
                              url: item.node.defaultImage.urlOriginal
                          },
                          price: {
                              regularPrice: {
                                  amount: {
                                      currency: item.node.prices.basePrice.currencyCode,
                                      value: item.node.prices.basePrice.value
                                  }
                              },
                              minimalPrice: {
                                  amount: {
                                      currency: item.node.prices.priceRange.min.currencyCode,
                                      value: item.node.prices.priceRange.min.value
                                  }
                              }
                          },
                          price_range: {
                              maximum_price: {
                                  regular_price: {
                                      currency: item.node.prices.priceRange.max.currencyCode,
                                      value: item.node.prices.priceRange.max.value
                                  }
                              }
                          },
                          custom_attributes: item.node.productOptions.edges
                              .map((option: any) =>
                                  !option.node.isVariantOption
                                      ? {
                                            __typename: 'CustomAttribute',
                                            selected_attribute_options: {
                                                __typename: 'SelectedAttributeOption',
                                                attribute_option: [
                                                    {
                                                        __typename: 'AttributeOption',
                                                        label: option.node.displayName
                                                    }
                                                ]
                                            },
                                            attribute_metadata: {
                                                __typename: 'AttributeMetadata',
                                                label: option.node.displayName
                                            }
                                        }
                                      : null
                              )
                              .filter((option: any) => option !== null) // TODO_B2B: Add custom attributes
                      }
            ),
            page_info: {
                total_pages: Math.ceil(data.site.search.searchProducts.products.edges.length / pageSize)
            },
            total_count: data.site.search.searchProducts.products.edges.length
        }
    };
};
