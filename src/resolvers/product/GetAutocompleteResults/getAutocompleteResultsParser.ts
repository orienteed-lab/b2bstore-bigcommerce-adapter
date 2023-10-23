import { GetAutocompleteResultsQuery } from '@schema';

export const getAutocompleteResultsParser = (data: any): GetAutocompleteResultsQuery => {
    const total_quantity_category = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'CategorySearchFilter') {
                item.node.categories.edges
                    .map((option: any) => {
                        total = total + 1;
                    })
                    .filter((option: any) => option !== null);
            }
        });
        return total;
    };
    const total_quantity_brand = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'BrandSearchFilter') {
                item.node.brands.edges.map((option: any) => {
                    total = total + 1;
                });
            }
        });
        return total;
    };
    const total_quantity_product = () => {
        var total = 0;
        data.site.search.searchProducts.filters.edges.map((item: any) => {
            if (item.node.__typename === 'ProductAttributeSearchFilter') {
                item.node.attributes.edges.map((option: any) => {
                    total = total + 1;
                });
            }
        });
        return total;
    };

    const getAggregations = () => {
        var items = [];
        data.site.search.searchProducts.filters.edges
            .map((item: any) => {
                item.node.__typename === 'CategorySearchFilter'
                    ? items.push({
                          label: item.node.name,
                          count: total_quantity_category(),
                          attribute_code: item.node.name,
                          options: item.node.categories.edges.map((option: any) => ({
                              label: option.node.name,
                              value: option.node.entityId
                          }))
                      })
                    : null,
                    item.node.__typename === 'BrandSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: total_quantity_brand(),
                              attribute_code: item.node.name,
                              options: item.node.brands.edges.map((option: any) => ({
                                  label: option.node.name,
                                  value: option.node.entityId
                              }))
                          })
                        : null,
                    item.node.__typename === 'OtherSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: {
                                  label: null,
                                  value: null
                              }
                          })
                        : null,
                    item.node.__typename === 'PriceSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: {
                                  label: null,
                                  value: null
                              }
                          })
                        : null,
                    item.node.__typename === 'SearchProductFilter'
                        ? items.push({
                              label: item.node.name,
                              count: 0, //It can't have any options
                              attribute_code: item.node.name,
                              options: {
                                  label: null,
                                  value: null
                              }
                          })
                        : null,
                    item.node.__typename === 'ProductAttributeSearchFilter'
                        ? items.push({
                              label: item.node.name,
                              count: total_quantity_product(),
                              attribute_code: item.node.name,
                              options: item.node.attributes.edges.map((option: any) => ({
                                  label: option.node.name,
                                  value: option.node.entityId
                              }))
                          })
                        : null;
            })
            .filter((option: any) => option !== null);

        return items;
    };

    const products_per_page = () => {
        var pages = 0;

        if (data.site.search.searchProducts.products.edges.length <= 12) {
            pages = 1;
        } else {
            pages = Math.ceil(data.site.search.searchProducts.products.edges.length % 12); //TODO_B2B: In Magento its always 12 products per page
        }

        return pages;
    };

    const getItems = () => {
        const items = [];

        for (const item of data.site.search.searchProducts.products.edges) {
            if (item.node.productOptions.edges.find((opt) => opt.node.isVariantOption)) {
                items.push({
                    __typename: 'ConfigurableProduct',
                    orParentSku: item.node.sku,
                    orParentUrlKey: item.node.path,
                    //@ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                    stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    name: item.node.name,
                    sku: item.node.sku,
                    uid: item.node.id,
                    id: item.node.entityId,
                    small_image: {
                        url: item.node.defaultImage.url
                    },
                    url_key: item.node.path.slice(1, -1),
                    url_suffix: '.html',
                    price: {
                        regularPrice: {
                            amount: {
                                currency: item.node.prices.price.currencyCode,
                                value: item.node.prices.price.value
                            }
                        },
                        minimalPrice: {
                            amount: {
                                currency: item.node.prices.priceRange.min.currencyCode,
                                value: item.node.prices.priceRange.min.value
                            }
                        }
                    },
                    custom_attributes: item.node.productOptions.edges
                        .map((option: any) =>
                            !option.node.isVariantOption
                                ? {
                                      entered_attribute_value: {
                                          value: option.node.defaultValue // TODO_B2B: Review
                                      },
                                      attribute_metadata: {
                                          __typename: 'AttributeMetadata',
                                          label: option.node.displayName
                                      },
                                      selected_attribute_options: {
                                          __typename: 'SelectedAttributeOption',
                                          attribute_option: [
                                              {
                                                  __typename: 'AttributeOption',
                                                  label: option.node.displayName,
                                                  is_default: option.node.defaultValue === null ? false : true // TODO_B2B: Review
                                              }
                                          ]
                                      }
                                  }
                                : null
                        )
                        .filter((option: any) => option !== null)
                });

                item.node.variants.edges.map((variant) =>
                    variant.node.productOptions.edges.find((opt) => opt.node.isVariantOption)
                        ? items.push({
                              __typename: 'SimpleProduct',
                              orParentSku: item.node.sku,
                              orParentUrlKey: item.node.path.slice(1, -1),
                              stock_status: variant.node.inventory.isInStock,
                              id: variant.node.entityId,
                              uid: variant.node.id,
                              name: `${item.node.name}-${variant.node.sku}`,
                              sku: variant.node.sku,
                              small_image: {
                                  __typename: 'ProductImage',
                                  url: variant.node.defaultImage ? variant.node.defaultImage.urlOriginal : item.node.defaultImage.url
                              },
                              url_key: item.node.path.slice(1, -1),
                              url_suffix: '.html',
                              price: {
                                  __typename: 'ProductPrices',
                                  regularPrice: {
                                      __typename: 'Price',
                                      amount: {
                                          __typename: 'Money',
                                          value: variant.node.prices.price.value,
                                          currency: variant.node.prices.price.currencyCode
                                      }
                                  },
                                  minimalPrice: {
                                      __typename: 'Price',
                                      amount: {
                                          __typename: 'Money',
                                          value: variant.node.prices.priceRange.min.value,
                                          currency: variant.node.prices.priceRange.min.currencyCode
                                      }
                                  }
                              },
                              custom_attributes: variant.node.productOptions.edges.map((opt) => ({
                                __typename: 'CustomAttribute',
                                entered_attribute_value: {
                                    __typename: 'EnteredAttributeValue',
                                    value: null
                                },
                                attribute_metadata: {
                                    __typename: 'ProductAttributeMetadata',
                                    label: opt.node.displayName
                                },
                                selected_attribute_options: {
                                    __typename: 'SelectedAttributeOption',
                                    attribute_option: opt.node.values.edges.map((val) => ({
                                        __typename: 'AttributeOption',
                                        label: val.node.label,
                                        is_default: val.node.isDefault
                                    }))
                                }
                            }))
                          })
                        : null
                );
            } else {
                items.push({
                    __typename: 'SimpleProduct',
                    orParentSku: item.node.sku,
                    orParentUrlKey: item.node.path,
                    //@ts-ignore // Ignore stock_status type error because we cannot import ProductStockStatus enum from the schema
                    stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    name: item.node.name,
                    sku: item.node.sku,
                    uid: item.node.id,
                    id: item.node.entityId,
                    small_image: {
                        url: item.node.defaultImage.url
                    },
                    url_key: item.node.path.slice(1, -1),
                    url_suffix: '.html',
                    price: {
                        regularPrice: {
                            amount: {
                                currency: item.node.prices.price.currencyCode,
                                value: item.node.prices.price.value
                            }
                        },
                        minimalPrice: {
                            amount: {
                                currency: item.node.prices.priceRange.min.currencyCode,
                                value: item.node.prices.priceRange.min.value
                            }
                        }
                    },
                    custom_attributes: item.node.productOptions.edges
                        .map((option: any) =>
                            !option.node.isVariantOption
                                ? {
                                      entered_attribute_value: {
                                          value: option.node.defaultValue // TODO_B2B: Review
                                      },
                                      attribute_metadata: {
                                          __typename: 'AttributeMetadata',
                                          label: option.node.displayName
                                      },
                                      selected_attribute_options: {
                                          __typename: 'SelectedAttributeOption',
                                          attribute_option: [
                                              {
                                                  __typename: 'AttributeOption',
                                                  label: option.node.displayName,
                                                  is_default: option.node.defaultValue === null ? false : true // TODO_B2B: Review
                                              }
                                          ]
                                      }
                                  }
                                : null
                        )
                        .filter((option: any) => option !== null)
                })
            }
        };

        return items;
    };

    return {
        products: {
            aggregations: getAggregations(),
            items: getItems(),
            page_info: {
                total_pages: products_per_page()
            },
            total_count: data.site.search.searchProducts.products.edges.length
        }
    };
};
