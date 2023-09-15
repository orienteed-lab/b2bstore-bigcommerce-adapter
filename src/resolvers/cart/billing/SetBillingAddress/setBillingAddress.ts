import { ClientProps } from 'src';
import { SetBillingAddressMutationVariables } from '@schema';

import { setBillingAddressParser } from './setBillingAddressParser';
import { useState } from 'react';

const SetBillingAddress = (clientProps: ClientProps) => (resolverProps: SetBillingAddressMutationVariables) => {
    // Look docs for more info about how to fill this function
    const { restClient } = clientProps;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [called, setCalled] = useState(false);
    
    const updateBillingAddress = async ({variables}) => {
        setLoading(true);
        setCalled(true);
        console.log("Variables: ", variables)
        
        const billingAddressBody = {
            first_name: variables.firstName,
            last_name: variables.lastName,
            address1: variables.street[0],
            address2: variables.street[1],
            city: variables.city,
            state_or_province: variables.regionCode,
            country_code: variables.countryCode,
            postal_code: variables.postcode,
            phone: variables.phoneNumber,
            }
        console.log("Billing Address BODY: ", billingAddressBody)
        try {
            if(variables.cartId){
                const billingAddressData = await restClient(
                    `/api/v3/checkouts/${variables.cartId}/billing-address`,
                    {
                        method: 'POST',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        },
                        body: JSON.stringify(billingAddressBody)
                    }
                );
 
            const paymentMethodData = await restClient(
                `/api/v3/payments/methods?checkout_id=${variables.cartId}`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                ) 
                console.log(billingAddressData)
                console.log(paymentMethodData)
                console.log(setBillingAddressParser(billingAddressData.data, paymentMethodData))
            }
        } catch (err) {
            setError(err);
            console.log("Error en la petición: " + error.message);
        }
        
        setLoading(false);
    }
    
    return { updateBillingAddress, loading, error, called };

};

export default SetBillingAddress;
