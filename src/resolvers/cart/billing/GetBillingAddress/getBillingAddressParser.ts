import { GetBillingAddressQuery } from '@schema';

export const getBillingAddressParser = (data: any): GetBillingAddressQuery => {
    console.log("Entrando al getBillingAddressParser..")
    return {
        cart : {
            __typename: 'Cart',
            id: data.billing_address.id,
            billingAddress: {
                __typename: 'BillingCartAddress',
                street: [data.billing_address.address1, data.billing_address.address2],
                city: data.billing_address.city,
                postcode: data.billing_address.postal_code,
                firstName: data.billing_address.first_name,
                lastName: data.billing_address.last_name,
                phoneNumber: data.billing_address.phone,
                country: {
                    __typename: 'CartAddressCountry',
                    code: data.billing_address.country_code,
                    label: data.billing_address.country
                },
                region: {
                    __typename: 'CartAddressRegion',
                    code: data.billing_address.state_or_province_code,
                    label: data.billing_address.state_or_province
                }
            }
               
        }
    };
};
