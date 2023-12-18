import { GetPaymentMethodsQuery } from '@schema';

export const getPaymentMethodsParser = (data: any, orderData): GetPaymentMethodsQuery => {
    const types = {
        // BigCommerce types: Manual, Credit Card, Cash,Test Payment Gateway, etc.
        store_credit: 'creditsystem',
        gift_certificate: 'giftcertificate', // TODO_B2BStore: Create a new file for gift certificate payments. This is MUST be changed
        card: 'banktransfer', // TODO_B2BStore: Check how to get the common credit card view
        braintree: 'braintree',
        bank_deposit: 'banktransfer',
        //'Credit Card': 'braintree',
        Cash: 'creditsystem',
        scheme: 'braintree'
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
