import { GetProductDetailForProductPageByUrlKeyQuery } from '@schema';

export const getProductDetailForProductPageByUrlKeyParser = (data: any): GetProductDetailForProductPageByUrlKeyQuery => {
    return {
        products: {
            items: [
                {
                    __typename: 'ConfigurableProduct',
                    name: data.site.route.node.name,
                    sku: data.site.route.node.sku,
                    orParentSku: data.site.route.node.sku,
                    meta_description: data.site.route.node.description,
                    description: {
                        __typename: 'ComplexTextValue',
                        html: data.site.route.node.description
                    },
                    uid: data.site.route.node.id,
                    id: data.site.route.node.entityId,
                    url_key: data.site.route.node.path,
                    // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                    stock_status: data.site.route.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    custom_attributes: [], // TODO_B2B: Add custom attributes
                    media_gallery_entries: data.site.route.node.images.edges.map((image: any) => ({
                        file: image.node.urlOriginal,
                        label: image.node.altText
                    })),
                    categories: data.site.route.node.categories.edges.map((category: any) => ({
                        uid: category.node.id,
                        id: category.node.entityId,
                        breadcrumbs: [
                            {
                                category_id: category.node.id
                            }
                        ]
                    })),
                    price: {
                        regularPrice: {
                            amount: {
                                currency: data.site.route.node.prices.price.currencyCode,
                                value: data.site.route.node.prices.price.value
                            }
                        },
                        minimalPrice: {
                            amount: {
                                currency: data.site.route.node.prices.priceRange.min.currencyCode,
                                value: data.site.route.node.prices.priceRange.min.value
                            }
                        }
                    },
                    price_range: {
                        maximum_price: {
                            final_price: {
                                currency: data.site.route.node.prices.priceRange.max.currencyCode,
                                value: data.site.route.node.prices.priceRange.max.value
                            }
                        }
                    },
                    configurable_options: data.site.route.node.productOptions.edges
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
                                                    value_index: value.node.entityId
                                                }))
                                              : []
                                  }
                                : null
                        )
                        .filter((option: any) => option !== null),
                    variants: data.site.route.node.variants.edges.map((variant: any) => ({
                        __typename: 'ConfigurableVariant',
                        attributes: variant.node.options.edges.map((attribute: any) => ({
                            __typename: 'ConfigurableAttributeOption',
                            code: attribute.node.displayName,
                            value_index: attribute.node.values.edges[0].node.entityId
                        })),
                        product: {
                            __typename: 'SimpleProduct',
                            name: `${data.site.route.node.name} ${variant.node.options.edges.map(
                                (attribute: any) => attribute.node.values.edges[0].node.label
                            )}`, //añadir los parámetros de la variante en le nombre
                            sku: variant.node.sku,
                            uid: variant.node.id,
                            // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                            stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                            media_gallery_entries: [
                                {
                                    __typename: 'MediaGalleryEntry',
                                    file: variant.node.defaultImage
                                        ? variant.node.defaultImage.urlOriginal
                                        : data.site.route.node.images.edges[0].node.urlOriginal
                                }
                            ],
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
                            },
                            custom_attributes: data.site.route.node.productOptions.edges
                                .map((option: any) =>
                                    !option.node.isVariantOption
                                        ? {
                                              __typename: 'CustomAttribute',
                                              selected_attribute_options: {
                                                  __typename: 'SelectedAttributeOption',
                                                  attribute_option: [
                                                      {
                                                          __typename: 'AttributeOption',
                                                          uid: option.node.entityId,
                                                          label: option.node.displayName,
                                                          is_default: false//option.node.values.edges.node.isDefault // TODO_B2B: Review
                                                      }
                                                  ]
                                              },
                                              entered_attribute_value: {
                                                  __typename: 'EnteredAttributeValue',
                                                  value: option.node.defaultValue // TODO_B2B: Review
                                              },
                                              attribute_metadata: {
                                                  __typename: 'AttributeMetadata',
                                                  uid: option.node.entityId,
                                                  code: option.node.displayName,
                                                  label: option.node.displayName
                                              }
                                          }
                                        : null
                                )
                                .filter((option: any) => option !== null)
                        }
                    }))
                }
            ]
        }
    };
};
