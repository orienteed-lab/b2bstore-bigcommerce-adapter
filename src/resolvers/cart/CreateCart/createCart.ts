import { ClientProps } from 'src';
import { CreateCartMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './createCart.gql';
import { useState } from 'react';

const CreateCart = (clientProps: ClientProps) => () => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const [error, setError] = useState(undefined);
    const [data, setData] = useState(undefined);

    const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCustomer = useAwaitQuery(getCustomerIdQuery);

    const fetchCartId = async () => {
        try {
            const { data: customerData } = await getCustomer({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                }
            });

            const body = !customerData.customer
                ? {
                      channel_id: 1,
                      line_items: []
                  }
                : {
                      channel_id: 1,
                      customer_id: customerData.customer.entityId,
                      line_items: []
                  };

            const rawData = await restClient(`/api/v3/carts`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify(body)
            });

            setData({ cartId: rawData.data.id });
        } catch (err) {
            setError(err);
        }

        return { data, error };
    };

    return { fetchCartId };
};

export default CreateCart;
