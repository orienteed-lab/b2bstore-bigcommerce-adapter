import { ClientProps } from 'src';
import { AddProductToCartMutationVariables } from '@schema';
import { addProductToCartParser } from './addProductToCartParser';

import DEFAULT_OPERATIONS from './addProductToCart.gql';
import { useState } from 'react';

interface AddProductToCartProps extends AddProductToCartMutationVariables {
    initialRun?: boolean;
}

const AddProductToCart =
    (clientProps: ClientProps) =>
    (resolverProps: AddProductToCartProps = { initialRun: false, cartId: '', product: { quantity: 0, sku: '' } }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { cartId, product } = resolverProps;
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const { getProductIdWithSkuQuery } = mergeOperations(DEFAULT_OPERATIONS);

        const getId = useAwaitQuery(getProductIdWithSkuQuery);

        const addProductToCart = async ({ variables }) => {
            setLoading(true);
            try {
                let parsedData = undefined;
                const { data } = await getId({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        sku: variables.product.sku
                    }
                });

                const prodId = data.site.product.entityId;
                const varId = data.site.product.variants.edges[0].node.entityId;
                parsedData = JSON.stringify(addProductToCartParser(variables, prodId, varId));

                await restClient(`/api/v3/carts/${variables.cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                });
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        const addWishlistItemToCart = async () => {
            setLoading(true);
            try {
                let parsedData = undefined;
                const variables = { cartId, product };
                const { data } = await getId({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        sku: variables.product.sku
                    }
                });

                if (variables.product.selected_options.length === 0) {
                    
                }

                const prodId = data.site.product.entityId;
                const varId = data.site.product.variants.edges[0].node.entityId;
                parsedData = JSON.stringify(addProductToCartParser(variables, prodId, varId));

                await restClient(`/api/v3/carts/${variables.cartId}/items`, {
                    method: 'POST',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    },
                    body: parsedData
                });
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        return { addProductToCart, addWishlistItemToCart, loading, error };
    };

export default AddProductToCart;
