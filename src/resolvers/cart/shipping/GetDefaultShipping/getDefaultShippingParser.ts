import { GetDefaultShippingQuery } from '@schema';

export const getDefaultShippingParser = (data: any): GetDefaultShippingQuery => {
    return data.length ? {
        customer: {
            default_shipping: data[0].id.toString()
        }
    } : null
};
