import { GetShippingMethodsQuery } from '@schema';

export const getShippingMethodsParser = (data: any): GetShippingMethodsQuery => {
    return {
        cart:  {
            id: data.id,
            shipping_addresses: data.consignments.map((cons) => ({
                country: {
                    code: cons.shipping_address.country_code
                },
                postcode: cons.shipping_address.postal_code,
                region: {
                    code: cons.shipping_address.state_or_province_code
                },
                street: [cons.shipping_address.address1, cons.shipping_address.address2],
                available_shipping_methods: cons.available_shipping_options.map((method) => ({
                    amount: {
                        currency: data.cart.currency.code,
                        value: method.cost
                    },
                    available: true,
                    carrier_code: method.id,
                    carrier_title: '',
                    method_code: method.type,
                    method_title: method.description
                })),
                selected_shipping_method: {
                    carrier_code: cons.selected_shipping_option?.id,
                    method_code: cons.selected_shipping_option?.type
                }
            }))
        }
    };
};
