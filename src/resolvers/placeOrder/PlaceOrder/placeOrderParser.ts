import { PlaceOrderMutation } from '@schema';

export const placeOrderParser = (data: any): PlaceOrderMutation => {
    return {
        placeOrder: {
            __typename: 'PlaceOrderOutput',
            order: {
                __typename: 'Order',
                order_number: data
            }
        }
    };
};
