export const addSimpleProductToCartParser = (data: any, prodId:any, variants:any) => {

    if (variants.length !== 0) {
        const variant_id = variants.find((variable) => variable.node.sku === data.sku).node.entityId;

        return {
            line_items: [
                {
                    quantity: data.quantity,
                    product_id: prodId,
                    variant_id: variant_id
                }
            ]
        };
    } else {
        return {
            line_items: [
                {
                    quantity: data.quantity,
                    product_id: prodId
                }
            ]
        }
    };
};
