import { ClientProps } from 'src';
import { RemoveItemFromCartMutationVariables } from '@schema';

import { useState } from 'react';

const RemoveItemFromCart = (clientProps: ClientProps) => (resolverProps: RemoveItemFromCartMutationVariables) => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [called, setCalled] = useState(false);

    const removeItemFromCart = ({ variables }) => {
        setLoading(true);
        setCalled(true);
        restClient(`/api/v3/carts/${variables.cartId}/items/${variables.itemId}`, {
            method: 'DELETE',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { removeItemFromCart, loading, error, called };
};

export default RemoveItemFromCart;
