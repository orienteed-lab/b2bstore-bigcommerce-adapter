import { ClientProps } from 'src';
import { SetShippingAddressMutationVariables } from '@schema';
import { useState } from 'react';

import { setShippingAddressParser } from './setShippingAddressParser';

const SetShippingAddress = (clientProps: ClientProps) => (resolverProps: SetShippingAddressMutationVariables) => {
    const { restClient } = clientProps;
    const [called, setCalled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const setShippingAddress = async ({ variables }) => {
        setLoading(true);
        setCalled(true);
        try {
            const { data: cartData } = await restClient(`/api/v3/checkouts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            const body = {
                address: {
                    email: cartData.cart.email,
                    city: variables.address.city,
                    first_name: variables.address.firstname,
                    last_name: variables.address.lastname,
                    address1: variables.address.street[0],
                    phone: variables.address.telephone,
                    country_code: variables.address.country_code,
                    postal_code: variables.address.postcode,
                    state_or_province: variables.address.region
                }
            };

            if (cartData.consignments.length === 0) {
                await restClient(`/v3/checkouts/${variables.cartId}/consignments`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body)
                });
            } else {
                await restClient(`/v3/checkouts/${variables.cartId}/consignments/${cartData.consignments[0].id}`, {
                    method: 'PUT',
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
    };

    const setShippingAddressOnCart = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        setCalled(true);
        try {
            const { data: cartData } = await restClient(`/api/v3/checkouts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            const body = {
                address: {
                    email: cartData.cart.email,
                    city: variables.city,
                    first_name: variables.firstname,
                    last_name: variables.lastname,
                    address1: variables.street[0],
                    phone: variables.telephone,
                    country_code: variables.country_id,
                    postal_code: variables.postcode,
                    state_or_province_code: variables.region_code
                }
            };

            if (cartData.consignments.length === 0) {
                await restClient(`/v3/checkouts/${variables.cartId}/consignments`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body)
                });
            } else {
                await restClient(`/v3/checkouts/${variables.cartId}/consignments/${cartData.consignments[0].id}`, {
                    method: 'PUT',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: JSON.stringify(body)
                });
            }

            const { data: newCartData } = await restClient(`/api/v3/checkouts/${variables.cartId}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            parsedData = setShippingAddressParser(newCartData);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
        return { data: parsedData };
    };

    return { setShippingAddress, setShippingAddressOnCart, called, loading, error };
};

export default SetShippingAddress;
