import { GetCustomerAddressesForAddressBookQuery } from '@schema';

export const getCustomerAddressesForAddressBookParser = (
    data: any,
    countryData: any,
    regionsData: any
): GetCustomerAddressesForAddressBookQuery => {
    return {
        customer: {
            id: data[0].customer_id,
            addresses: data.map((address: any, index) => ({
                __typename: 'CustomerAddresses',
                id: address.id,
                company: address.company,
                city: address.city,
                country_code: address.country_code,
                default_billing: index == 0, //TODO_B2B: Get is default_billing
                default_shipping: index == 0, //TODO_B2B: Get is default_shipping
                firstname: address.first_name,
                lastname: address.last_name,
                middlename: '',
                postcode: address.postal_code,
                region: {
                    region: address.state_or_province,
                    // region_code: regionsData[index].state_abbreviation,
                    // region_id: regionsData[index].country_id
                    region_code: '', // They are not necessary and with this we prevent excesive loading rates
                    region_id: '' // They are not necessary and with this we prevent excesive loading rates
                },
                street: [address.address1],
                telephone: address.phone,
                vat_id: 1 //TODO_B2B
            }))
        },
        countries: countryData.map((country) => ({
            id: country.country_iso2,
            full_name_locale: country.country
        }))
    };
};
