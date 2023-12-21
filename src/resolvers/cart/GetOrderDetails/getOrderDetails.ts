import { ClientProps } from 'src';
import { GetOrderDetailsQueryVariables } from '@schema';
import { useState } from 'react';

import { getOrderDetailsParser } from './getOrderDetailsParser';

const GetOrderDetails = (clientProps: ClientProps) => (resolverProps: GetOrderDetailsQueryVariables) => {
    const { restClient } = clientProps;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(undefined);

    const getOrderDetails = async ({ variables }) => {
        setLoading(true);
        const { data: rawData } = await restClient(
            `/api/v3/checkouts/${variables.cartId}?include=cart.line_items.physical_items.options,cart.line_items.digital_items.options`,
            {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            }
        );
        const orderData = await restClient(`/api/v2/orders?cart_id=${variables.cartId}&include=consignments`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });
        const addresses = await restClient(`/api/v2/orders/${orderData[0].id}/shipping_addresses`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        setData(getOrderDetailsParser(rawData, addresses, orderData[0]));
        setLoading(false);
    };

    return { data, loading, getOrderDetails };
};

export default GetOrderDetails;
