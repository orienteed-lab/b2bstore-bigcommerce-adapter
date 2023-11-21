import { SetShippingAddressMutation } from '@schema';

export const setShippingAddressParser = (data: any): SetShippingAddressMutation => {
    return {
        setShippingAddressesOnCart: {
            cart: {
                id: data.id,
                total_quantity: data.consignments[0].line_item_ids.length,
                shipping_addresses: data.consignments.map((cons) => ({
                    available_shipping_methods: cons.available_shipping_options.map((opt) => ({
                        available: true, // If it's in the list we understand that is available
                        carrier_code: '',
                        carrier_title: '',
                        method_code: '',
                        method_title: opt.type,
                        amount: {
                            currency: data.cart.currency.code,
                            value: opt.cost
                        }
                    }))
                }))
            }
        }
    };
};
