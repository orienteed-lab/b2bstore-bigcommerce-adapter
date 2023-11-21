import { ClientProps } from 'src';
import { SetDefaultBillingAddressMutationVariables } from '@schema';
import { useState } from 'react';

const SetDefaultBillingAddress = (clientProps: ClientProps) => (resolverProps: SetDefaultBillingAddressMutationVariables) => {
    const { restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateDefaultBillingAddress = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            const orderData = await restClient(`/api/v2/orders?cart_id=${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            const { data: addressData } = await restClient(`/api/v3/customers/addresses?id:in=${variables.customerAddressId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            await restClient(`/api/v2/orders/${orderData[0].id}`, {
                method: 'PUT',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({
                    billing_address: {
                        first_name: addressData[0].first_name,
                        last_name: addressData[0].last_name,
                        company: addressData[0].company,
                        street_1: addressData[0].address1,
                        street_2: addressData[0].address2,
                        city: addressData[0].city,
                        state: addressData[0].state_or_province,
                        zip: addressData[0].postal_code,
                        country: addressData[0].country,
                        country_iso2: addressData[0].country_code,
                        phone: addressData[0].phone
                    }
                })
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { updateDefaultBillingAddress, called, loading, error };
};

export default SetDefaultBillingAddress;
