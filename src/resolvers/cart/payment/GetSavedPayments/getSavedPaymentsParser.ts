import { GetSavedPaymentsQuery } from '@schema';

export const getSavedPaymentsParser = (data: any): GetSavedPaymentsQuery => {
    const types = {
        // BigCommerce types: Manual, Credit Card, Cash,Test Payment Gateway, etc.
        store_credit: 'creditsystem',
        gift_certificate: 'braintree', // TODO_B2B: Create a new file for gift certificate payments. This is MUST be changed
        card: 'braintree', // TODO_B2B: Check how to get the common credit card view
        braintree: 'braintree',
        bank_deposit: 'banktransfer',
        'Credit Card': 'braintree',
        Cash: 'creditsystem'
    };

    return {
        customerPaymentTokens: {
            __typename: 'CustomerPaymentTokens',
            items: data.length
                ? data.map((method) => ({
                      __typename: 'PaymentToken',
                      payment_method_code: types[method.type],
                      public_hash: method.token, // TODO_B2B: is this the token needed for the payment method to work?
                      details: null
                  }))
                : []
        }
    };
};
