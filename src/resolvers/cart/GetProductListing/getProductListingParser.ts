import { GetProductListingQuery } from '@schema';

export const getProductListingParser = ({data}: any): GetProductListingQuery => {
    
    const getItems = () => {
        var items = [];
        if (data.line_items.physical_items) {
            data.line_items.physical_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.currency.code
                              },
                              row_total: {
                                  __typename: 'Money',
                                  value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              small_image: {
                                  __typename: 'ProductImage',
                                  url: item.image_url, // TODO_B2B: Reduce size of the image
                                  label: item.name // TODO_B2B: Review
                              },
                              stock_status: 'IN_STOCK', // TODO_B2B: Get stock status (maybe if a product is in cart there must be stock)
                              price: {
                                  regularPrice: {
                                      __typename: 'Price',
                                      amount: {
                                          __typename: 'Money',
                                          value: item.sale_price // TODO_B2B: Review
                                      }
                                  }
                              },
                              variants: item.options.map((variant: any) => ({
                                  attributes: {
                                      uid: variant.nameId,
                                      label: variant.value,
                                      code: variant.name,
                                      value_index: variant.valueId
                                  },
                                  product: {
                                      uid: item.variant_id,
                                      name: `${item.name}${item.sku}`,
                                      sku: item.sku, // El sku por defecto es el de la variante
                                      stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                                      small_image: {
                                          url: item.image_url // TODO_B2B: Reduce size of the image & check if it's possible to get variant image
                                      }
                                  }
                              }))
                          },
                          quantity: item.quantity, // TODO_B2B: Check how to get total item count
                          errors: null, // BigCommerce doesn't return an error status
                          // {
                          //     code
                          //     message
                          // }
                          configurable_options: item.options.map((variant: any) => ({
                              id: variant.nameId,
                              configurable_product_option_uid: variant.nameId,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.valueId,
                              value_label: variant.value,
                              value_id: variant.valueId
                          }))
                      })
                    : items.push({
                          __typename: 'SimpleCartItem',
                          uid: item.id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.currency.code
                              },
                              row_total: {
                                  __typename: 'Money',
                                  value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              small_image: {
                                  url: item.image_url, // TODO_B2B: Reduce size of the image
                                  label: item.name // TODO_B2B: Review
                              },
                              stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                              price: {
                                  regularPrice: {
                                      amount: {
                                          value: item.sale_price // TODO_B2B: Review
                                      }
                                  }
                              },
                              variants: []
                          },
                          quantity: item.quantity, // TODO_B2B: Check how to get total item count
                          errors: null, // BigCommerce doesn't return an error status
                          // {
                          //     code
                          //     message
                          // }
                          configurable_options: []
                      });
            });
        }

        if (data.line_items.digital_items) {
            data.line_items.digital_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.currency.code
                              },
                              row_total: {
                                  __typename: 'Money',
                                  value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              small_image: {
                                  __typename: 'ProductImage',
                                  url: item.image_url, // TODO_B2B: Reduce size of the image
                                  label: item.name // TODO_B2B: Review
                              },
                              stock_status: 'IN_STOCK', // TODO_B2B: Get stock status (maybe if a product is in cart there must be stock)
                              price: {
                                  regularPrice: {
                                      __typename: 'Price',
                                      amount: {
                                          __typename: 'Money',
                                          value: item.sale_price // TODO_B2B: Review
                                      }
                                  }
                              },
                              variants: item.options.map((variant: any) => ({
                                  attributes: [
                                      {
                                          uid: variant.nameId,
                                          label: variant.value,
                                          code: variant.name,
                                          value_index: variant.valueId
                                      }
                                  ],
                                  product: {
                                      uid: item.variant_id,
                                      name: `${item.name}${item.sku}`,
                                      sku: item.sku, // El sku por defecto es el de la variante
                                      stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                                      small_image: {
                                          url: item.image_url // TODO_B2B: Reduce size of the image & check if it's possible to get variant image
                                      }
                                  }
                              }))
                          },
                          quantity: item.quantity, // TODO_B2B: Check how to get total item count
                          errors: null, //BigCommerce doesn't return an error status
                          // {
                          //     code
                          //     message
                          // }
                          configurable_options: item.options.map((variant: any) => ({
                              id: variant.nameId,
                              configurable_product_option_uid: variant.nameId,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.valueId,
                              value_label: variant.value,
                              value_id: variant.valueId
                          }))
                      })
                    : items.push({
                          __typename: 'SimpleCartItem',
                          uid: item.id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.currency.code
                              },
                              row_total: {
                                  __typename: 'Money',
                                  value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              small_image: {
                                  url: item.image_url, // TODO_B2B: Reduce size of the image
                                  label: item.name // TODO_B2B: Review
                              },
                              stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                              price: {
                                  regularPrice: {
                                      amount: {
                                          value: item.sale_price // TODO_B2B: Review
                                      }
                                  }
                              },
                              variants: []
                          },
                          quantity: item.quantity, // TODO_B2B: Check how to get total item count
                          errors: null, //BigCommerce doesn't return an error status
                          // {
                          //     code
                          //     message
                          // }
                          configurable_options: []
                      });
            });
        }

        if (data.line_items.custom_items) {
            data.line_items.custom_items.map((item: any) => {
                items.push({
                    __typename: 'SimpleCartItem',
                    uid: item.id,
                    prices: {
                        __typename: 'ProductPrices',
                        price: {
                            __typename: 'Money',
                            value: item.list_price,
                            currency: data.currency.code
                        },
                        row_total: {
                            __typename: 'Money',
                            value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                        },
                        total_item_discount: {
                            __typename: 'Money',
                            value: 0
                        }
                    },
                    product: {
                        __typename: 'SimpleProduct',
                        uid: item.id,
                        name: item.name,
                        sku: item.sku,
                        url_key: '', // TODO_B2B: It doesn't have url
                        thumbnail: {
                            url: item.image_url // TODO_B2B: Reduce size of the image
                        },
                        small_image: {
                            url: item.image_url, // TODO_B2B: Reduce size of the image
                            label: item.name // TODO_B2B: Review
                        },
                        stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                        price: {
                            regularPrice: {
                                amount: {
                                    value: item.list_price // TODO_B2B: Review
                                }
                            }
                        },
                        variants: []
                    },
                    quantity: item.quantity, // TODO_B2B: Check how to get total item count
                    errors: null, // BigCommerce doesn't return an error status
                    // {
                    //     code
                    //     message
                    // }
                    configurable_options: []
                });
            });
        }
        return items;
    };

    return {
        cart: {
            __typename: 'Cart',
            id: data.id,
            items: getItems()
        }
    };
};
