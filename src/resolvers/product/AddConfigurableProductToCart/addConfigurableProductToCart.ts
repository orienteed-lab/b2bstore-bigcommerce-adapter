import { ClientProps } from 'src';
import { AddConfigurableProductToCartMutationVariables } from '@schema';
import { addConfigurableProductToCartParser } from './addConfigurableProductToCartParser';

import { useState } from 'react';

const AddConfigurableProductToCart = (clientProps: ClientProps) => (resolverProps: AddConfigurableProductToCartMutationVariables = {cartId: "", parentSku: "", quantity: 0, sku: ""}) => {
    const { restClient } = clientProps;
    const { cartId, quantity, sku } = resolverProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addConfigurableProductToCart = ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        restClient(`/api/v3/catalog/variants?sku=CONF1-BM`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        }).then((data) => {
            parsedData = JSON.stringify(addConfigurableProductToCartParser(data, variables.quantity));
            restClient(`/api/v3/carts/0c035cfe-0006-4fb9-b183-610c98c53c05/items`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: parsedData
            });
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    };

    const addConfigurableProductToCartVoid = () => {
        let parsedData = undefined;
        setLoading(true);
        restClient(`/api/v3/catalog/variants?sku=${sku}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        }).then((data) => {
            parsedData = JSON.stringify(addConfigurableProductToCartParser(data, quantity));
            restClient(`/api/v3/carts/${cartId}/items`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: parsedData
            });
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    };

    return { addConfigurableProductToCart, addConfigurableProductToCartVoid, loading, error };
};

export default AddConfigurableProductToCart;
