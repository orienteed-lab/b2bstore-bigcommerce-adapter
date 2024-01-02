import { GetSavedCartsQuery } from '@schema';

export const getSavedCartsParser = (data: any, pageSize: any, currentPage: any): GetSavedCartsQuery => {

    const getTotalCost = (cart) => {
        let totalPrice = 0;
        cart.items.forEach((prod: any) => {
            totalPrice = totalPrice + Number.parseFloat(prod.subtotal_converted);
        });

        return totalPrice;
    }

    return {
        mpSaveCartGetCarts: {
            total_count: data.length,
            page_info: {
                current_page: currentPage,
                page_size: pageSize
            },
            items: data.map(cart => ({
                cart_id: cart.id,
                created_at: cart.createdAt*1000,
                cart_name: cart.name,
                description: cart.description,
                share_url: cart.id,
                token: cart.id,
                cart_total: {
                    currency: cart.currency,
                    value: getTotalCost(cart)
                },
                items: cart.items
            }))
        }
    }
};
