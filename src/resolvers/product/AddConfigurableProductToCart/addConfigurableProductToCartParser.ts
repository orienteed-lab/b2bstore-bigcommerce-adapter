export const addConfigurableProductToCartParser = (data: any, quantity: any) => {
    return {
        line_items: [
            {
                quantity: quantity,
                product_id: data.data[0].product_id,
                variant_id: data.data[0].id
            }
        ]
    };
};
