import { ClientProps } from 'src';
import { AddConfigurableProductToCartMutationVariables } from '@schema';
import { addConfigurableProductToCartParser } from './addConfigurableProductToCartParser';

import { useState } from 'react';

interface AddConfigurableProductToCartProps extends AddConfigurableProductToCartMutationVariables {
    hasProps: boolean;
}

const AddConfigurableProductToCart =
    (clientProps: ClientProps) =>
    (resolverProps: AddConfigurableProductToCartProps = { cartId: '', parentSku: '', quantity: 0, sku: '', hasProps: false }) => {
        const { restClient } = clientProps;
        const { cartId, quantity, sku, hasProps } = resolverProps;
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const addConfigurableProductToCart = async ({ variables }) => {
            let parsedData = undefined;
            setLoading(true);
            try {
                const data = await restClient(`/api/v3/catalog/variants?sku=${variables.sku}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
                parsedData = JSON.stringify(addConfigurableProductToCartParser(data, variables.quantity));
                await restClient(`/api/v3/carts/${variables.cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                });
            } catch (err) {
                setError(err);
            };
            setLoading(false);
        };

        const addConfigurableProductToCartVoid = async () => {
            let parsedData = undefined;
            setLoading(true);
            try {
                const data = await restClient(`/api/v3/catalog/variants?sku=${sku}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
                parsedData = JSON.stringify(addConfigurableProductToCartParser(data, quantity));
                await restClient(`/api/v3/carts/${cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                });
            } catch (err) {
                setError(err);
            };
            setLoading(false);
        };

        if (hasProps) {
            return { addConfigurableProductToCart: addConfigurableProductToCartVoid, loading, error };
        } else {
            return { addConfigurableProductToCart, loading, error };
        }
    };

export default AddConfigurableProductToCart;
