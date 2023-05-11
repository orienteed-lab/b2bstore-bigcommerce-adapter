import { GetItemCountQuery } from '@schema';

export const getItemCountParser = ({data}: any): GetItemCountQuery => {
    
    const total_quantity = () => {
        var total = 0;
        if (data.line_items.physical_items) {
            data.line_items.physical_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.digital_items) {
            data.line_items.digital_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        if (data.line_items.custom_items) {
            data.line_items.custom_items.map((item: any) => {
                total = total + item.quantity;
            });
        }
        return total;
    };

    return {
        cart:{
            __typename: 'Cart',
            id: data.Id,
            total_quantity: total_quantity()

        }
    };
};
