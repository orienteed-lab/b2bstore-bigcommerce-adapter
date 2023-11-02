import { GetShippingInformationQuery } from '@schema';

export const getShippingInformationParser = (data: any): GetShippingInformationQuery => {
    return {
        cart: {
            id: data.id,
            email: data.cart.email,
            shipping_addresses: data.consignments.map((ship) => ({
                city: ship.shipping_address.city,
                country: {
                    code: ship.shipping_address.country_code,
                    label: ship.shipping_address.country_code
                },
                firstname: ship.shipping_address.first_name,
                lastname: ship.shipping_address.last_name,
                postcode: ship.shipping_address.postal_code,
                region: {
                    code: ship.shipping_address.state_or_province_code,
                    label: ship.shipping_address.state_or_province,
                    region_id: 1
                },
                street: [ship.shipping_address.address1, ship.shipping_address.address2],
                telephone: ship.shipping_address.phone
            }))
        }
    };
};
