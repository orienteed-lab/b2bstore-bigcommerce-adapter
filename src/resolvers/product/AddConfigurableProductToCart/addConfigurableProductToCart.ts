import { ClientProps } from 'src';
import { AddConfigurableProductToCartMutationVariables } from '@schema';

import { useState } from 'react';

interface AddConfigurableProductToCartProps extends AddConfigurableProductToCartMutationVariables {
    // Needed interface to add the necessary props from the front
    hasProps: boolean;
}

const AddConfigurableProductToCart =
    (clientProps: ClientProps) =>
    (resolverProps: AddConfigurableProductToCartProps = { cartId: '', parentSku: '', quantity: 0, sku: '', hasProps: false }) => {
        // TODO_B2BStore: Complete this resolver using the REST API of BigCommerce
        const { hasProps } = resolverProps;
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(undefined);

        const addConfigurableProductToCartVoid = () => {
            // TODO_B2BStore: inside we will have functions that require await
        };

        const addConfigurableProductToCart = ({}) => {
            // TODO_B2BStore: We need to get parameters from the front; inside we will have functions that require await
        };

        
        // Conditional for all the possible returns of this resolver. You don't need to touch this, just understand what is needed in each case. Notice that THERE IS NO RETURN OF DATA
        if (hasProps) {
            return { addConfigurableProductToCart: addConfigurableProductToCartVoid, loading, error };
        } else {
            return { addConfigurableProductToCart, loading, error };
        }
    };

export default AddConfigurableProductToCart;
