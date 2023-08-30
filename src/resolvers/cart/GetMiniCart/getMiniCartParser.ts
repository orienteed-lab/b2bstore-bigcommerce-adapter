import { GetMiniCartQuery } from '@schema';

export const getMiniCartParser = ({ data }: any): GetMiniCartQuery => {
    const getTotalQuantity = () => {
        let total = 0;
        if (data.line_items.physical_items.length !== 0) {
            data.line_items.physical_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.digital_items.length !== 0) {
            data.line_items.digital_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.custom_items.length !== 0) {
            data.line_items.custom_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        return total;
    };

    const getItems = () => {
        let items = [];
        if (data.line_items.physical_items.length !== 0) {
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
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.product_id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              stock_status: 'IN_STOCK', // TODO_B2B: Get stock status (maybe if a product is in cart there must be stock)
                              variants: [
                                  {
                                      attributes: item.options.map((variant: any) => ({
                                          uid: variant.nameId,
                                          label: variant.value
                                      })),
                                      product: {
                                          uid: item.variant_id,
                                          name: `${item.name}${item.sku}`,
                                          sku: item.sku, // El sku por defecto es el de la variante
                                          thumbnail: {
                                              url: item.image_url // TODO_B2B: Reduce size of the image & check if it's possible to get variant image
                                          }
                                      }
                                  }
                              ]
                          },
                          quantity: item.quantity,
                          configurable_options: item.options.map((variant: any) => ({
                              configurable_product_option_uid: variant.nameId,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.valueId,
                              value_label: variant.value
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
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.product_id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                              variants: []
                          },
                          quantity: item.quantity,
                          configurable_options: []
                      });
            });
        }

        if (data.line_items.digital_items.length !== 0) {
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
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.product_id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              stock_status: 'IN_STOCK', // TODO_B2B: Get stock status (maybe if a product is in cart there must be stock)
                              variants: item.options.map((variant: any) => ({
                                  attributes: [
                                      {
                                          uid: variant.nameId,
                                          label: variant.value
                                      }
                                  ],
                                  product: {
                                      uid: item.variant_id,
                                      name: `${item.name}${item.sku}`,
                                      sku: item.sku, // El sku por defecto es el de la variante
                                      thumbnail: {
                                          url: item.image_url // TODO_B2B: Reduce size of the image & check if it's possible to get variant image
                                      }
                                  }
                              }))
                          },
                          quantity: item.quantity,
                          configurable_options: item.options.map((variant: any) => ({
                              configurable_product_option_uid: variant.nameId,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.valueId,
                              value_label: variant.value
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
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.product_id,
                              name: item.name,
                              sku: item.sku,
                              url_key: item.url,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                              variants: []
                          },
                          quantity: item.quantity,
                          configurable_options: []
                      });
            });
        }

        if (data.line_items.custom_items.length !== 0) {
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
                        total_item_discount: {
                            __typename: 'Money',
                            value: 0
                        }
                    },
                    product: {
                        __typename: 'SimpleProduct',
                        uid: item.product_id,
                        name: item.name,
                        sku: item.sku,
                        url_key: '', // TODO_B2B: It doesn't have url
                        thumbnail: {
                            url: item.image_url // TODO_B2B: Reduce size of the image
                        },
                        stock_status: 'IN_STOCK', // You can´t add a product to cart if it doesn't have stock
                        variants: []
                    },
                    quantity: item.quantity,
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
            total_quantity: getTotalQuantity(),
            prices: {
                subtotal_excluding_tax: {
                    currency: data.currency.code,
                    value: data.base_amount
                },
                subtotal_including_tax: {
                    currency: data.currency.code,
                    value: data.cart_amount
                }
            },
            items: getItems()
        }
    };
};
