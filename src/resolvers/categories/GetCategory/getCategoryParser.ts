import { GetCategoryQuery } from '@schema';

export const getCategoryParser = (data: any, currentPage, pageSize): GetCategoryQuery => {
    const total_pages = Math.ceil(data.site.search.searchProducts.products.collectionInfo.totalItems / pageSize);

    const products = () => {
        let productList: any = [];
        for (let i = 0; i < pageSize; i++) {
            if (data.site.search.searchProducts.products.edges[i + pageSize * (currentPage - 1)]) {
                productList.push(data.site.search.searchProducts.products.edges[i + pageSize * (currentPage - 1)]);
            }
        }
        productList.filter((product: any) => product !== null);
        return productList;
    };

    return {
        categories: {
            __typename: 'CategoryResult',
            items: data.site.categoryTree.map((category: any) => ({
                __typename: 'CategoryTree',
                uid: category.entityId,
                meta_title: category.name,
                meta_description: category.description
            }))
        },
        products: {
            items: products().map((item: any) =>
                item.node.variants.edges.length != 0 && item.node.variants.edges[0].node.productOptions.edges.length != 0
                    ? {
                          __typename: 'ConfigurableProduct',
                          id: item.node.id,
                          uid: item.node.entityId.toString(),
                          name: item.node.name,
                          sku: item.node.sku,
                          stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                          rating_summary: item.node.reviewSummary.summationOfRatings,
                          type_id: item.node.type,
                          url_key: item.node.path.slice(1, -1),
                          url_suffix: '.html',
                          variants: item.node.variants.edges.map((variant: any) => ({
                              attributes: variant.node.procuctOptions
                                  ? variant.node.procuctOptions.edges.map((attribute: any) => ({
                                        code: attribute.node.displayName,
                                        value_index: attribute.node.entityId //TODO_B2B: Review
                                    }))
                                  : [],
                              product: {
                                  stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                                  uid: variant.node.entityId,
                                  name: `${item.node.name} ${
                                      variant.node.procuctOptions
                                          ? variant.node.procuctOptions.edges.map((attribute) => attribute.node.displayName)
                                          : null
                                  }`,
                                  sku: variant.node.sku,
                                  description: {
                                      html: item.node.description
                                  },
                                  categories: item.node.categories.edges.map((category: any) => ({
                                      __typename: 'CategoryTree',
                                      name: category.node.name
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
                                  }
                              }
                          })),
                          configurable_options: item.node.productOptions.edges.map((option: any) => ({
                              attribute_code: option.node.displayName, //TODO_B2B: is the displayName the attribute_code?
                              attribute_id: option.node.entityId,
                              uid: option.node.entityId.toString(),
                              label: option.node.displayName,
                              values: option.node.values
                                  ? option.node.values.edges.map((value: any) => ({
                                        default_label: value.node.label, //TODO_B2B: check if it's default
                                        label: value.node.label,
                                        store_label: value.node.label,
                                        use_default_value: value.node.isDefault, //TODO_B2B: Check if it's the right default
                                        value_index: value.node.entityId,
                                        uid: value.node.entityId.toString(),
                                        swatch_data: null
                                    }))
                                  : [
                                        {
                                            default_label: option.node.label ? option.node.label : option.node.displayName, //TODO_B2B: check if it's default
                                            label: option.node.label ? option.node.label : option.node.displayName,
                                            store_label: option.node.label ? option.node.label : option.node.displayName,
                                            // use_default_value: ,
                                            value_index: option.node.entityId,
                                            uid: option.node.entityId.toString(),
                                            swatch_data: null
                                        }
                                    ],

                              variants: item.node.variants.edges.map((variant: any) => ({
                                  attributes: variant.node.procuctOptions
                                      ? variant.node.procuctOptions.edges.map((attribute: any) => ({
                                            code: attribute.node.displayName,
                                            value_index: attribute.node.entityId //TODO_B2B: Review
                                        }))
                                      : [],
                                  product: {
                                      stock_status: variant.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                                      uid: variant.node.entityId,
                                      name: `${item.node.name} ${
                                          variant.node.procuctOptions
                                              ? variant.node.procuctOptions.edges.map((attribute) => attribute.node.displayName)
                                              : null
                                      }`,
                                      sku: variant.node.sku,
                                      description: {
                                          html: item.node.description
                                      },
                                      categories: item.node.categories.edges.map((category: any) => ({
                                          __typename: 'CategoryTree',
                                          name: category.node.name
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
                                      }
                                  }
                              }))
                          })),
                          price_range: {
                              maximum_price: {
                                  regular_price: {
                                      currency: item.node.prices.priceRange.max.currencyCode,
                                      value: item.node.prices.priceRange.max.value
                                  }
                              }
                          },
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
                          small_image: {
                              url: item.node.images.edges.length !== 0 ? item.node.images.edges[0].node.url : ''
                          }
                      }
                    : {
                          __typename: 'SimpleProduct',
                          id: item.node.id,
                          uid: item.node.entityId.toString(),
                          name: item.node.name,
                          sku: item.node.sku,
                          stock_status: item.node.inventory.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                          rating_summary: item.node.reviewSummary.summationOfRatings,
                          type_id: item.node.type,
                          url_key: item.node.path.slice(1, -1),
                          url_suffix: '.html',
                          price_range: {
                              maximum_price: {
                                  regular_price: {
                                      currency: item.node.prices.priceRange.max.currencyCode,
                                      value: item.node.prices.priceRange.max.value
                                  }
                              }
                          },
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
                          small_image: {
                              url: item.node.images.edges.length !== 0 ? item.node.images.edges[0].node.url : ''
                          }
                      }
            ),
            page_info: {
                total_pages: total_pages
            },
            total_count: data.site.search.searchProducts.products.collectionInfo.totalItems
        }
    };
};
