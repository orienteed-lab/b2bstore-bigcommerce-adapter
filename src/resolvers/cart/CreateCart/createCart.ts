import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './createCart.gql';
import { useCallback, useState } from 'react';

const CreateCart = (clientProps: ClientProps) => () => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;

    const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCustomer = useAwaitQuery(getCustomerIdQuery);

    const fetchCartId = useCallback(async () => {
        let data = undefined;
        let errors = undefined;
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

            data = { cartId: rawData.data.id };
        } catch (err) {
            errors = err;
        }

        return { data, errors };
    }, []);

    return { fetchCartId };
};

export default CreateCart;
