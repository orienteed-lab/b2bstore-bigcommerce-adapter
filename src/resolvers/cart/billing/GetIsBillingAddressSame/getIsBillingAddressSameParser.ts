import { GetIsBillingAddressSameQuery } from '@schema';

export const getIsBillingAddressSameParser = (data: any): GetIsBillingAddressSameQuery => {
    let isBillingAddressSame = false
    
    const billingAddressData = { ...data.billing_address };
    delete billingAddressData.id;
    const shippingAddressData = data.consignments[0].address
    

    if (JSON.stringify(billingAddressData) === JSON.stringify(shippingAddressData)){
        isBillingAddressSame = true
    }
    
    return {
        __typename: 'Query',
        cart: data.id
            ? {
                  __typename: 'Cart',
                  id: data.id,
                  isBillingAddressSame: isBillingAddressSame,
              }
            : null,
    };
};
