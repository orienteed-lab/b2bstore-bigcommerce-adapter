export const addProductToCartParser = (data: any, prodId: any, varId: any) => {
    const options = () => {
        let opt = [];

        if (data.product.selected_options) {
            data.product.selected_options.map((option) =>
                opt.push({
                    option_id: option,
                    option_value: ''
                })
            );
        }

        if (data.product.entered_options) {
            data.product.entered_options.map((option) =>
                opt.push({
                    option_id: option.uid,
                    option_value: option.value
                })
            );
        }

        return opt;
    };

    return {
        line_items: [
            {
                quantity: data.product.quantity,
                product_id: prodId,
                variant_id: varId,
                option_selections: options()
            }
        ]
    };
};
