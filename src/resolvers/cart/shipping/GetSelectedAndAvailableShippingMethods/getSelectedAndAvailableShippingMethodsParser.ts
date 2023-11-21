import { GetSelectedAndAvailableShippingMethodsQuery } from '@schema';

export const getSelectedAndAvailableShippingMethodsParser = (data: any, countries: any, regions: any): GetSelectedAndAvailableShippingMethodsQuery => {
    return {
        cart: {
            __typename: 'Cart',
            id: data.id,
            email: data.cart.email,
            shipping_addresses: data.consignments.map((cons, index) => ({
                __typename: 'ShippingCartAddress',
                city: cons.shipping_address.city,
                country: {
                    code: cons.shipping_address.country_code,
                    label: countries[index]
                },
                firstname: cons.shipping_address.first_name,
                lastname: cons.shipping_address.last_name,
                street: [cons.shipping_address.address1, cons.shipping_address.address2],
                postcode: cons.shipping_address.postal_code,
                region: {
                    code: cons.shipping_address.state_or_province_code,
                    label: cons.shipping_address.state_or_province,
                    region_id: regions[index]
                },
                telephone: cons.shipping_address.phone,
                available_shipping_methods: cons.available_shipping_options.map((option) => ({
                    __typename: 'AvailableShippingMethod',
                    amount: {
                        currency: data.cart.currency.code,
                        value: option.cost
                    },
                    available: true,
                    carrier_code: option.id,
                    carrier_title: '',
                    method_code: option.type,
                    method_title: option.description
                })),
                selected_shipping_method: {
                    __typename: 'SelectedShippingMethod',
                    amount: {
                        currency: data.cart.currency.code,
                        value: cons.selected_shipping_option?.cost
                    },
                    carrier_code: cons.selected_shipping_option?.id,
                    method_code: cons.selected_shipping_option?.type,
                    method_title: cons.selected_shipping_option?.description
                }
            }))
        }
    };
};
