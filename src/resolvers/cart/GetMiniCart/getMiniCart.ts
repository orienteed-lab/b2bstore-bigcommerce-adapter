import { ClientProps } from 'src';
import { GetMiniCartQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getMiniCartParser } from './getMiniCartParser';

const GetMiniCart =
    (clientProps: ClientProps) =>
    (resolverProps: GetMiniCartQueryVariables = { cartId: null }) => {
        const { restClient } = clientProps;
        const { cartId } = resolverProps;
        const [loading, setLoading] = useState(true);
        const [data, setData] = useState<any>(null);

        useEffect(() => {
            const fetchMiniCart = async () => {
                setLoading(true);
                if (cartId) {
                    const rawData = await restClient(
                        `/api/v3/carts/${cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );

                    setData(getMiniCartParser(rawData));
                }
                setLoading(false);
            };
            fetchMiniCart();
        }, []);

        return { data, loading };
    };

export default GetMiniCart;
