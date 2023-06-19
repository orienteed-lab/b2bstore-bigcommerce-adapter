import { GetCustomerInformationQuery } from '@schema';

export const getCustomerInformationParser = (dataCustomer: any, rawData: any): GetCustomerInformationQuery => {
    return {
        customer: {
            id: dataCustomer.customer.entityId,
            firstname: dataCustomer.customer.firstName,
            lastname: dataCustomer.customer.lastName,
            email: dataCustomer.customer.email,
            taxvat: dataCustomer.customer.taxExemptCategory,
            is_subscribed: rawData!==null? (dataCustomer.customer.email === rawData.email? true:false): false,
            default_shipping: null, //Bigcommerce doesn't have this option
            mp_quote_id: null //TODO_B2B: Review
        }
    };
};
