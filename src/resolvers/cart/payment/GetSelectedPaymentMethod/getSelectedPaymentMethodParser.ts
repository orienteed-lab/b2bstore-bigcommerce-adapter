import { GetSelectedPaymentMethodQuery } from '@schema';

export const getSelectedPaymentMethodParser = (data: any): GetSelectedPaymentMethodQuery => {
    const types = {
        // BigCommerce types: Manual, Credit Card, Cash,Test Payment Gateway, etc.
        store_credit: 'creditsystem',
        gift_certificate: 'giftcertificate', // TODO_B2BStore: Create a new file for gift certificate payments. This is MUST be changed
        card: 'banktransfer', // TODO_B2BStore: Check how to get the common credit card view
        braintree: 'braintree',
        bank_deposit: 'banktransfer',
        'Credit Card': 'braintree',
        Cash: 'creditsystem',
        scheme: 'braintree'
    };

    const titles = {
        store_credit: 'Store Credit',
        gift_certificate: 'Gift Certificate',
        card: 'Credit Card',
        braintree: 'Braintree',
        bank_deposit: 'Bank Transfer',
        'Credit Card': 'Credit Card',
        Cash: 'Cash',
        scheme: 'Credit Card'
    }

    return {
        cart: {
            __typename: 'Cart',
            id: data.cart_id,
            selected_payment_method: {
                __typename: 'SelectedPaymentMethod',
                code: types[data.payment_method],
                title: titles[data.payment_method]
            }
        }
    }
};
