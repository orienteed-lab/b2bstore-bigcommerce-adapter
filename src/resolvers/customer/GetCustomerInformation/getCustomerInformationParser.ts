import { GetCustomerInformationQuery } from '@schema';

export const getCustomerInformationParser = (dataCustomer: any, rawData: any, shippingData: any): GetCustomerInformationQuery => {
    return {
        customer: {
            id: dataCustomer.customer.entityId,
            firstname: dataCustomer.customer.firstName,
            lastname: dataCustomer.customer.lastName,
            email: dataCustomer.customer.email,
            taxvat: dataCustomer.customer.taxExemptCategory,
            is_subscribed: !!(rawData && dataCustomer.customer.email === rawData.email),
            default_shipping: shippingData[0].addresses[0].id.toString(),
            mp_quote_id: null //TODO_B2B: Review
        }
    };
};
