import { ClientProps } from 'src';
import { AddProductToCartMutationVariables } from '@schema';
import { addProductToCartParser } from './addProductToCartParser';

import DEFAULT_OPERATIONS from './addProductToCart.gql';
import { useState } from 'react';

const AddProductToCart =
    (clientProps: ClientProps) =>
    (resolverProps: AddProductToCartMutationVariables = { cartId: '', product: { quantity: 0, sku: '' } }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { cartId, product } = resolverProps;
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const { getProductIdWithSkuQuery } = mergeOperations(DEFAULT_OPERATIONS);

        const getId = useAwaitQuery(getProductIdWithSkuQuery);

        const addProductToCart = async ({ variables }) => {
            let parsedData = undefined;
            console.log(variables.product.sku);
            const { data } = await getId({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: 'SM13'
                }
            });

            if (data) {
                const prodId = data.site.product.entityId;
                const varId = data.site.product.variants.edges[0].node.entityId;
                parsedData = JSON.stringify(addProductToCartParser(variables, prodId, varId));
                console.log('PIUM PIUM', parsedData);
                setLoading(true);
                restClient(`/api/v3/carts/${variables.cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        setError(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        };

        const addProductToCartVoid = async () => {
            let parsedData = undefined;
            const variables = { cartId, product };
            console.log(variables.product.sku);
            const { data } = await getId({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: 'SM13'
                }
            });

            if (data) {
                const prodId = data.site.product.entityId;
                const varId = data.site.product.variants.edges[0].node.entityId;
                parsedData = JSON.stringify(addProductToCartParser(variables, prodId, varId));
                console.log('PIUM PIUM', parsedData);
                setLoading(true);
                restClient(`/api/v3/carts/${variables.cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        setError(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        };

        return { addProductToCart, addProductToCartVoid, loading, error };
    };

export default AddProductToCart;
