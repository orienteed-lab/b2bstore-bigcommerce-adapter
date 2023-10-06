import { ClientProps } from 'src';
import { AddSimpleProductToCartMutationVariables } from '@schema';
import { addSimpleProductToCartParser } from './addSimpleProductToCartParser';

import DEFAULT_OPERATIONS from './addSimpleProductToCart.gql';
import { useState } from 'react';

const AddSimpleProductToCart = (clientProps: ClientProps) => (resolverProps: AddSimpleProductToCartMutationVariables) => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { getProductIdWithSkuQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getId = useAwaitQuery(getProductIdWithSkuQuery);

    const addSimpleProductToCart = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        try {
            const { data } = await getId({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    sku: variables.sku
                }
            });

            const prodId = data.site.product.entityId;
            parsedData = JSON.stringify(addSimpleProductToCartParser(variables, prodId));

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

    return { addSimpleProductToCart, loading, error };
};

export default AddSimpleProductToCart;
