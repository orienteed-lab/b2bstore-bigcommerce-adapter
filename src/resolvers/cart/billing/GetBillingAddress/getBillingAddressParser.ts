import { GetBillingAddressQuery } from '@schema';

export const getBillingAddressParser = (data: any): GetBillingAddressQuery => {
    return {
      cart: {
        __typename: 'Cart',
        id: data.billing_address.id,
        billingAddress: data.billing_address
          ? {
              __typename: 'BillingCartAddress',
              street: [data.billing_address.address1 || null, data.billing_address.address2 || null],
              city: data.billing_address.city,
              postcode: data.billing_address.postal_code || null,
              firstName: data.billing_address.first_name,
              lastName: data.billing_address.last_name,
              phoneNumber: data.billing_address.phone || null,
              country: data.billing_address.country_code
                ? {
                    __typename: 'CartAddressCountry',
                    code: data.billing_address.country_code,
                    label: data.billing_address.country,
                  }
                : null,
              region: data.billing_address.state_or_province_code
                ? {
                    __typename: 'CartAddressRegion',
                    code: data.billing_address.state_or_province_code,
                    label: data.billing_address.state_or_province,
                  }
                : null,
            }
          : null,
      },
    };
  };
