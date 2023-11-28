import { GetSalesRulesDataQuery } from '@schema';

export const getSalesRulesDataParser = (data: any): GetSalesRulesDataQuery => {
    const total_quantity = () => {
        var total = 0;
        if (data.line_items.physical_items) {
            data.line_items.physical_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.digital_items) {
            data.line_items.digital_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.custom_items) {
            data.line_items.custom_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        return total;
    };

    const getItems = () => {
        var items = [];

        if (data.line_items.physical_items) {
            data.line_items.physical_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.id,
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.id,
                              weight: item.weight
                          }
                      })
                    : items.push({
                          __typename: 'SimpleItem',
                          uid: item.id,
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.id,
                              weight: item.weight //The only way to get the weight is doing a request to a Cart, not a checkout
                          }
                      });
            });
        }

        if (data.line_items.digital_items) {
            data.line_items.digital_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'DownloadableCartItem',
                          uid: item.id,
                          product: {
                              __typename: 'DownloadableProduct',
                              uid: item.id
                          }
                      })
                    : items.push({
                          __typename: 'DownloadableCartItem',
                          uid: item.id,
                          product: {
                              __typename: 'DownloadableProduct',
                              uid: item.id
                          }
                      });
            });
        }

        if (data.line_items.custom_items) {
            data.line_items.custom_items.map((item: any) => {
                items.push({
                    __typename: 'DownloadableCartItem',
                    uid: item.id,
                    product: {
                        __typename: 'VirtualProduct',
                        uid: item.id
                    }
                });
            });
        }
        return items;
    };

    
    return {
        cart: {
            __typename: 'Cart',
            id: data.id,
            total_quantity: total_quantity(),
            items: getItems(),
            prices:{
                __typename:'CartPrices',
                subtotal_excluding_tax: {
                    __typename:'Money',
                    value: data.base_amount
                },
                subtotal_including_tax: {
                    __typename:'Money',
                    value: data.cart_amount
                }
            },
            selected_payment_method: null, //In Bigcommerce, is impossible to get selected payment method in cart
            shipping_addresses: null // In BigCommerce, there are no shipping addresses in cart 
        }
    };
}
