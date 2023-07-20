import { GetCustomerSubscriptionQuery } from '@schema';

export const getCustomerSubscriptionParser = (data: any): GetCustomerSubscriptionQuery => {
    return {
        customer: {
            is_subscribed: data !== null? true : false
        }
    };
};
