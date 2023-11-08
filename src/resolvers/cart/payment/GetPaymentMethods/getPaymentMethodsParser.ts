import { GetPaymentMethodsQuery } from '@schema';

export const getPaymentMethodsParser = (data: any, orderData): GetPaymentMethodsQuery => {
    const types = {
        store_credit: 'creditsystem',
        gift_certificate: 'braintree', // TODO_B2BStore: Create a new file for gift certificate payments. This is MUST be changed
        card: 'braintree', // TODO_B2BStore: Check how to get the common credit card view
        braintree: 'braintree',
        bank_deposit: 'banktransfer'
    };

    return {
        cart: {
            id: orderData[0].cart_id,
            available_payment_methods: data.map((method) =>
                types[method.type]
                    ? {
                          code: types[method.type],
                          title: method.name
                      }
                    : null
            ),
            selected_payment_method: {
                code: types[orderData[0].payment_method] ? types[orderData[0].payment_method] : ''
            }
        }
    };
};
