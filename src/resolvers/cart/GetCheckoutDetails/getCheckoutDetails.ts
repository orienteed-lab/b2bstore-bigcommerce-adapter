import { ClientProps } from 'src';
import { GetCheckoutDetailsQueryVariables } from '@schema';

import { getCheckoutDetailsParser } from './getCheckoutDetailsParser';
import { useEffect, useState } from 'react';

const GetCheckoutDetails =
    (clientProps: ClientProps) =>
    (resolverProps: GetCheckoutDetailsQueryVariables = { cartId: null }) => {
        const { restClient } = clientProps;
        const { cartId } = resolverProps;

        const [data, setData] = useState(undefined);
        const [networkStatus, setNetworkStatus] = useState(undefined);

        useEffect(() => {
            const fetchData = async () => {
                setNetworkStatus(1); // loading
                if (cartId) {
                    try {
                        const rawData = await restClient(
                            `/api/v3/checkouts/${cartId}?include=cart.line_items.physical_items.options,cart.line_items.digital_items.options`,
                            {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            }
                        );
                        const rawData2 = await restClient(`/api/v2/payments/methods`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });
                        setData(getCheckoutDetailsParser(rawData, rawData2));
                    } catch {
                        setNetworkStatus(8); // error
                    }
                }
                setNetworkStatus(7); // ready
            };
            fetchData();
        }, []);

        return { data, networkStatus };
    };

export default GetCheckoutDetails;
