import { GetItemsInCartQuery } from '@schema';

export const getItemsInCartParser = (data: any): GetItemsInCartQuery => {
    
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

    const createCartItem = (item, data) => {
        const categories = item.categories.map((categoryName) => ({
            __typename: 'CategoryTree',
            name: categoryName,
        }));
        const object = item.options.length !== 0 ? {
            __typename: 'ConfigurableCartItem',
            uid: item.id,
            quantity: item.quantity,
            product: {
                __typename: 'ConfigurableProduct',
                uid: item.id,
                sku: item.sku,
                name: item.name,
                categories: categories,
                thumbnail: {
                    __typename: 'ProductImage',
                    url: item.image_url 
                }
            },
            prices: {
                __typename: 'CartItemPrices',
                price: {
                    __typename: 'Money',
                    currency: data.currency.code,
                    value: item.original_price
                },
                row_total: {
                    __typename: 'Money',
                    value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                },
                total_item_discount: {
                    __typename: 'Money',
                    value: item.discount_amount
                }
            },
            configurable_options: item.options.map((variant: any) => ({
                configurable_product_option_uid: variant.name_id,
                option_label: variant.name,
                configurable_product_option_value_uid: variant.value_id,
                value_label: variant.value
            }))
        }
        :{
            __typename: 'SimpleCartItem',
            uid: item.id,
            quantity: item.quantity,
            product: {
                __typename: 'ConfigurableProduct',
                uid: item.id,
                sku: item.sku,
                name: item.name,
                categories: categories,
                thumbnail: {
                    __typename: 'ProductImage',
                    url: item.image_url 
                }
            },
            prices: {
                __typename: 'CartItemPrices',
                price: {
                    __typename: 'Money',
                    currency: data.currency.code,
                    value: item.original_price
                },
                row_total: {
                    __typename: 'Money',
                    value: item.list_price // TODO_B2B: Check if list price is row total; row total=((ordered item price * ordered item qty) + Tax) - Discount
                },
                total_item_discount: {
                    __typename: 'Money',
                    value: item.discount_amount
                }
            },
        }
        return object;
    };
    
    const getItems = () => {
        var items = [];
    
        if (data.line_items.physical_items) {
            data.line_items.physical_items.forEach((item) => {
                items.push(createCartItem(item, data));
            });
        }
    
        if (data.line_items.digital_items) {
            data.line_items.digital_items.forEach((item) => {
                items.push(createCartItem(item, data));
            });
        }
    
        if (data.line_items.custom_items) {
            data.line_items.custom_items.forEach((item) => {
                items.push(createCartItem(item, data));
            });
        }
    
        return items;
    };

    return {
        cart: {
            __typename: 'Cart',
            id: data.id,
            total_quantity: total_quantity(),
            items: getItems()
        }
    };
};
