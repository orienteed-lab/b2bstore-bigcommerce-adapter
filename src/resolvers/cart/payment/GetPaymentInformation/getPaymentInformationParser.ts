import { GetPaymentInformationQuery } from '@schema';

export const getPaymentInformationParser = (checkoutData: any, orderData: any, paymentsData: any): GetPaymentInformationQuery => {
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

    return {
        cart: {
            __typename: 'Cart',
            id: checkoutData.id,
            shipping_addresses: checkoutData.consignments.map((cons) => ({
                __typename: 'ShippingCartAddress',
                city: cons.shipping_address.city,
                country: {
                    __typename: 'CartAddressCountry',
                    code: cons.shipping_address.country_code
                },
                firstname: cons.shipping_address.first_name,
                lastname: cons.shipping_address.last_name,
                street: [cons.shipping_address.address1, cons.shipping_address.address2],
                postcode: cons.shipping_address.postal_code,
                region: {
                    __typename: 'CartAddressRegion',
                    code: cons.shipping_address.state_or_province_code
                },
                telephone: cons.shipping_address.phone
            })),
            available_payment_methods: paymentsData.map((method) => ({
                __typename: 'AvailablePaymentMethod',
                code: types[method.type],
                title: method.name
            })),
            selected_payment_method: {
                __typename: 'SelectedPaymentMethod',
                code: orderData.payment_method ? types[orderData.payment_method] : ''
            }
        }
    };
};
