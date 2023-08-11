import { ClientProps } from 'src';
import { UpdateConfigurableOptionsMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './updateConfigurableOptions.gql';
import { useState } from 'react';

const UpdateConfigurableOptions = (clientProps: ClientProps) => (resolverProps: UpdateConfigurableOptionsMutationVariables) => {
    const { mergeOperations, useAwaitQuery, useMutation } = clientProps;
    const [called, setCalled] = useState(false);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const { updateConfigurableOptionsMutation, getProductIdBySkuQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getProductId = useAwaitQuery(getProductIdBySkuQuery);
    const [updateOptions] = useMutation(updateConfigurableOptionsMutation);

    const updateConfigurableOptions = async ({ variables }) => {
        setCalled(true);
        setLoading(true);
        try {
            const { data: prodData } = await getProductId({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: { parentSku: variables.parentSku }
            });

            const productId = prodData.site.product.entityId;
            const variantId = prodData.site.product.variants.edges.find((variant) => variant.node.sku === variables.variantSku).node
                .entityId;

            await updateOptions({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                },
                variables: {
                    item: {
                        cartEntityId: variables.cartId,
                        lineItemEntityId: variables.cartItemId,
                        data: {
                            lineItem: {
                                quantity: variables.quantity,
                                productEntityId: productId,
                                variantEntityId: variantId
                            }
                        }
                    }
                }
            });
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { updateConfigurableOptions, loading, error, called };
};

export default UpdateConfigurableOptions;
