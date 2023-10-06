import { GetProductDetailForConfigurableOptionsBySkuQuery } from '@schema';

export const getProductDetailForConfigurableOptionsBySkuParser = (data: any): GetProductDetailForConfigurableOptionsBySkuQuery => {
    return {
        products: {
            items: [
                {
                    __typename: 'ConfigurableProduct',
                    id: data.site.product.entityId,
                    uid: data.site.product.id,
                    //meta_description: data.site.product.plainTextDescription,
                    name: data.site.product.name,
                    sku: data.site.product.sku,
                    //@ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                    stock_status: data.site.product.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    url_key: data.site.product.path,
                    categories: data.site.product.categories.edges.map((category: any) => ({
                        __typename: 'CategoryTree',
                        uid: category.node.id,
                        breadcrumbs: [
                            {
                                __typename: 'Breadcrumb',
                                category_uid:  category.node.id
                            }
                        ]  
                    })),
                    configurable_options: data.site.product.productOptions.edges
                        .map((option: any) =>
                            option.node.isVariantOption
                                ? {
                                      __typename: 'ConfigurableProductOptions',
                                      attribute_code: option.node.displayName,
                                      attribute_id: option.node.entityId.toString(),
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
                                                    swatch_data: '' //TODO_B2B: Review
                                                }))
                                              : []
                                  }
                                : null
                        )
                        .filter((option: any) => option !== null),
                    variants: data.site.product.variants.edges.map((variant: any) => ({
                        __typename: 'ConfigurableVariant',
                        attributes: variant.node.options.edges.map((attribute: any) => ({
                            __typename: 'ConfigurableAttributeOption',
                            code: attribute.node.displayName,
                            value_index: attribute.node.values.edges[0].node.entityId
                        })),
                        product: {
                            __typename: 'SimpleProduct',
                            name: `${data.site.product.name} ${variant.node.options.edges.map(
                                (attribute: any) => attribute.node.values.edges[0].node.label
                            )}`, //añadir los parámetros de la variante en le nombre
                            sku: variant.node.sku,
                            uid: variant.node.id,
                            // @ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                            stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                            description: data.site.product.description,
                            short_description: data.site.product.plainTextDescription, //TODO_B2B: Review
                            categories: data.site.product.categories.edges.map((category: any) => ({
                                name: category.name //TODO_B2B: Review
                            })),
                            media_gallery_entries: [{
                                __typename: 'MediaGalleryEntry',
                                uid: variant.node.id,
                                label: '', //TODO_B2B: Review
                                position: 10, //TODO_B2B: Review
                                disabled: !variant.node.isPurchasable
                                // file: variant.node.defaultImage
                                //         ? variant.node.defaultImage.urlOriginal
                                //         : data.site.product.images.edges[0].node.urlOriginal //TODO_B2B: Review
                            }],

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
                    })),
                    small_image: {
                        url: data.site.product.defaultImage.urlOriginal
                    },
                    price: {
                        regularPrice: {
                            amount: {
                                currency: data.site.product.prices.basePrice.currencyCode,
                                value: data.site.product.prices.basePrice.value
                            }
                        },
                        minimalPrice: {
                            amount: {
                                currency: data.site.product.prices.priceRange.min.currencyCode,
                                value: data.site.product.prices.priceRange.min.value
                            }
                        }
                    },
                    price_range: {
                        maximum_price: {
                            regular_price: {
                                currency: data.site.product.prices.priceRange.max.currencyCode,
                                value: data.site.product.prices.priceRange.max.value
                            }
                        }
                    },
                    custom_attributes: data.site.product.productOptions.edges
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
                                                  is_default: option.node.defaultValue === null ? false : true // TODO_B2B: Review 
                                              }
                                          ]
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
                        .filter((option: any) => option !== null) // TODO_B2B: Add custom attributes
                }
            ]
        }
    };
};
