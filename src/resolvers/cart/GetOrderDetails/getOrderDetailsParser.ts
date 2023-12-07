import { GetOrderDetailsQuery } from '@schema';

export const getOrderDetailsParser = (data: any, addresses: any, orderData: any): GetOrderDetailsQuery => {
    const total_quantity = () => {
        let total = 0;
        if (data.cart.line_items.physical_items) {
            data.cart.line_items.physical_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.cart.line_items.digital_items) {
            data.cart.line_items.digital_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.cart.line_items.custom_items) {
            data.cart.line_items.custom_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        return total;
    };

    const getItems = () => {
        let items = [];
        if (data.cart.line_items.physical_items) {
            data.cart.line_items.physical_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.product_id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.cart.currency.code
                              },
                              /*row_total: {
                                  __typename: 'Money',
                                  //Price before discounts
                                  value: item.extended_list_price - item.discount_amount // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                                  //sale_price (Price of the item after all discounts are applied. (The final price before tax calculation.))

                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount // TODO_B2B: discount_amount & discounts array are different?
                              }*/
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.variant_id,
                              name: item.name,
                              sku: item.sku,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              categories: [
                                  {
                                      name: 'PHYSICALCONFIGURED' // TODO_B2B: Get categories of the products
                                  }
                              ]
                          },
                          quantity: item.quantity,
                          configurable_options: item.options.map((variant: any) => ({
                              configurable_product_option_uid: variant.name_id,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.value_id,
                              value_label: variant.value
                          }))
                      })
                    : items.push({
                          __typename: 'SimpleCartItem',
                          uid: item.product_id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.cart.currency.code
                              },
                              /*row_total: {
                                  __typename: 'Money',
                                  value: item.extended_list_price - item.discount_amount // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }*/
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.product_id,//item.variant_id,
                              name: item.name,
                              sku: item.sku,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              categories: [
                                  {
                                      name: 'PHYSICALSIMPLE' // TODO_B2B: Get categories of the products
                                  }
                              ]
                          },
                          quantity: item.quantity
                      });
            });
        }

        if (data.cart.line_items.digital_items) {
            data.cart.line_items.digital_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.product_id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  currency: data.cart.currency.code
                              },
                              /*row_total: {
                                  __typename: 'Money',
                                  value: item.extended_list_price - item.discount_amount // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount // TODO_B2B: discount_amount & discounts array are different?
                              }*/
                          },
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.variant_id,
                              name: item.name,
                              sku: item.sku,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              categories: [
                                  {
                                      name: 'VIRTUALCONFIGURED' // TODO_B2B: Get categories of the products
                                  }
                              ]
                          },
                          quantity: item.quantity,
                          configurable_options: item.options.map((variant: any) => ({
                              configurable_product_option_uid: variant.name_id,
                              option_label: variant.name,
                              configurable_product_option_value_uid: variant.value_id,
                              value_label: variant.value
                          }))
                      })
                    : items.push({
                          __typename: 'SimpleCartItem',
                          uid: item.product_id,
                          prices: {
                              __typename: 'ProductPrices',
                              price: {
                                  __typename: 'Money',
                                  value: item.original_price,
                                  //Cart issue? data.currency.code
                                  currency: data.cart.currency.code
                              },
                              /*row_total: {
                                  __typename: 'Money',
                                  value: item.extended_list_price - item.discount_amount // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                              },
                              total_item_discount: {
                                  __typename: 'Money',
                                  value: item.discount_amount
                              }*/
                          },
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.variant_id,
                              name: item.name,
                              sku: item.sku,
                              thumbnail: {
                                  url: item.image_url // TODO_B2B: Reduce size of the image
                              },
                              categories: [
                                  {
                                      name: 'PHYSICALSIMPLE' // TODO_B2B: Get categories of the products
                                  }
                              ]
                          },
                          quantity: item.quantity
                      });
            });
        }

        //El mismo que el de SimpleProduct, pero utiliza el id del carrito
        /*if (data.cart.line_items.physical_items) {
            data.cart.line_items.physical_items.map((item: any) => {
                items.push({
                    __typename: 'SimpleCartItem',
                    uid: item.id,
                    prices: {
                        __typename: 'ProductPrices',
                        price: {
                            __typename: 'Money',
                            value: item.list_price,
                            currency: data.cart.currency.code // TODO_B2B: Get currency
                        },
                        row_total: {
                            __typename: 'Money',
                            value: item.extended_list_price - item.discount_amount // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
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
                        thumbnail: {
                            url: item.image_url // TODO_B2B: Reduce size of the image
                        },
                        categories: [
                            {
                                name: 'PHYSICALPHYSICALSIMPLE' // TODO_B2B: Get categories of the products
                            }
                        ]
                    },
                    quantity: item.quantity
                });
            });
        }*/

        return items;
    };

    return {
        cart: {
            id: data.id,
            email: data.cart.email,
            total_quantity: total_quantity(),
            items: getItems(),
            shipping_addresses: addresses.map((address) => ({
                firstname: address.first_name,
                lastname: address.last_name,
                street: [address.street_1, address.street_2],
                city: address.city,
                region: {
                    label: address.state
                },
                postcode: address.zip,
                country: {
                    label: address.country
                },
                selected_shipping_method: {
                    // TODO_B2B: Check how to get the selected shipping method (if necessary)
                    amount: {
                        value: address.cost_inc_tax, // TODO_B2B: Check if Magento only uses shipping cost or even the handling cost
                        currency: orderData.currency_code
                    },
                    //(Specifies the type of shipping option, such as flat rate, UPS, etc).
                    carrier_title: data.consignments[0].selected_shipping_option.type.split(" - ")[0], // TODO_B2B: Find and get carrier_title equivalent 
                    method_title: address.shipping_method
                }
            })),
            selected_payment_method: {
                // TODO_B2B: Check how to get the selected payment method (if necessary)
                purchase_order_number: "FUEGO FUEGO", // TODO_B2B: Check what it is and get its BigCommerce equivalent
                title: orderData.payment_method
            },
            prices: {
                applied_taxes: data.taxes.map((tax) => ({
                    amount: {
                        currency: data.cart.currency.code,
                        value: tax.amount
                    },
                    label: tax.name
                })),
                grand_total: {
                    value: data.grand_total,
                    currency: data.cart.currency.code
                },
                subtotal_excluding_tax: {
                    currency: data.cart.currency.code,
                    value: data.subtotal_ex_tax
                },
                discounts: data.coupons.map((coupon) => ({
                    amount: {
                        currency: data.cart.currency.code,
                        value: coupon.discounted_amount
                    },
                    label: coupon.code
                }))
            }
        }
    };
};
