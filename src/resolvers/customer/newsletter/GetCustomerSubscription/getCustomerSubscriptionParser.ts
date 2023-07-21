import { GetCustomerSubscriptionQuery } from '@schema';

export const getCustomerSubscriptionParser = ({data}: any): GetCustomerSubscriptionQuery => {
    return {
        customer: {
            is_subscribed: data.length !== 0 ? true : false
        }
    };
};
