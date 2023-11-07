import { ClientProps } from 'src';
import { AddSimpleProductToCartMutationVariables } from '@schema';

import { useState } from 'react';

const AddSimpleProductToCart = (clientProps: ClientProps) => (resolverProps: AddSimpleProductToCartMutationVariables) => {
    // TODO_B2BStore: Complete this resolver using the REST API of BigCommerce to add the products to cart, use GraphQL to get the necessary information
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const addSimpleProductToCart = ({}) => {
        // TODO_B2BStore: We need to get parameters from the front; inside we will have functions that require await
    };

    return { addSimpleProductToCart, loading, error }; // Return of the necessary variables. You don't need to touch this, just understand what is needed. Notice that THERE IS NO RETURN OF DATA
};

export default AddSimpleProductToCart;
