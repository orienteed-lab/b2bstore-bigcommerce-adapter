export const addSimpleProductToCartParser = (data: any, prodId:any) => {
    return {
        line_items: [
            {
                quantity: data.quantity,
                product_id: prodId
            }
        ]
    }
};
