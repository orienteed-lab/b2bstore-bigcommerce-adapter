import { iterateObserversSafely } from '@apollo/client/utilities';
import { GetCheckoutDetailsQuery } from '@schema';
import GetItemCount from '../GetItemCount/getItemCount';

export const getCheckoutDetailsParser = ({ data }: any, data2): GetCheckoutDetailsQuery => {
    const types = {
        // BigCommerce types: Manual, Credit Card, Cash,Test Payment Gateway, etc.
        bigcommerce_store_credit: 'creditsystem',
        bigcommerce_gift_certificate: 'banktransfer', // TODO_B2BStore: Create a new file for gift certificate payments. This is MUST be changed
        card: 'banktransfer', // TODO_B2BStore: Check how to get the common credit card view
        braintree: 'braintree',
        bankdeposit: 'banktransfer',
        bigpaypay: 'braintree',
        Cash: 'creditsystem',
        adyenv3: 'braintree'
    };

    const total_quantity = () => {
        var total = 0;
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
        var items = [];

        if (data.cart.line_items.physical_items) {
            data.cart.line_items.physical_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.id,
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.id,
                              stock_status: 'IN_STOCK' //If there is no stock you can't add it to cart
                          }
                      })
                    : items.push({
                          __typename: 'SimpleItem',
                          uid: item.id,
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.id,
                              stock_status: 'IN_STOCK' //If there is no stock you can't add it to cart
                          }
                      });
            });
        }

        if (data.cart.line_items.digital_items) {
            data.cart.line_items.digital_items.map((item: any) => {
                item.options.length !== 0
                    ? items.push({
                          __typename: 'ConfigurableCartItem',
                          uid: item.id,
                          product: {
                              __typename: 'ConfigurableProduct',
                              uid: item.id,
                              stock_status: 'IN_STOCK' //If there is no stock you can't add it to cart
                          }
                      })
                    : items.push({
                          __typename: 'SimpleItem',
                          uid: item.id,
                          product: {
                              __typename: 'SimpleProduct',
                              uid: item.id,
                              stock_status: 'IN_STOCK' //If there is no stock you can't add it to cart
                          }
                      });
            });
        }

        if (data.cart.line_items.custom_items) {
            data.cart.line_items.custom_items.map((item: any) => {
                items.push({
                    __typename: 'SimpleItem',
                    uid: item.id,
                    product: {
                        __typename: 'SimpleProduct',
                        uid: item.id,
                        stock_status: 'IN_STOCK' //If there is no stock you can't add it to cart
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
            available_payment_methods: data2.map((method: any) => ({
                __typename: "AvailablePaymentMethod",
                code: types[method.code]
            }))
        }
    };
};
