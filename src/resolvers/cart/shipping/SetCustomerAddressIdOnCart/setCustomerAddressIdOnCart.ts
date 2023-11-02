import { ClientProps } from 'src';
import { SetCustomerAddressIdOnCartMutationVariables } from '@schema';

import { setCustomerAddressIdOnCartParser } from './setCustomerAddressIdOnCartParser';
import { useState } from 'react';

interface SetCustomerAddressIdOnCartProps extends SetCustomerAddressIdOnCartMutationVariables {
    onSuccess?: any,
    hasOnSuccess: boolean
}

const SetCustomerAddressIdOnCart = (clientProps: ClientProps) => (resolverProps: SetCustomerAddressIdOnCartProps) => {
    const { restClient } = clientProps;
    const { hasOnSuccess } = resolverProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const setDefaultAddressOnCart = async ({ variables }) => {
        setLoading(true);
        try {
            const { data: addressData } = await restClient(`/api/v3/customers/addresses?id:in=${variables.addressId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            const { data: checkoutData } = await restClient(`/api/v3/checkouts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            let body = setCustomerAddressIdOnCartParser(addressData[0], checkoutData);

            if (checkoutData.consignments.length !== 0) {
                await restClient(`/api/v3/checkouts/${variables.cartId}/consignments/${checkoutData.consignments[0].id}`, {
                    method: 'PUT',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body[0])
                });
            } else {
                await restClient(`/api/v3/checkouts/${variables.cartId}/consignments`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body)
                });
            }
        } catch (err) {
            setError(err);
        }
        setLoading(false);
        if (hasOnSuccess && !error) {
            const { onSuccess } = resolverProps;
            onSuccess();
        }
    };

    return { setCustomerAddressOnCart: setDefaultAddressOnCart, setDefaultAddressOnCart, loading, error };
};

export default SetCustomerAddressIdOnCart;
