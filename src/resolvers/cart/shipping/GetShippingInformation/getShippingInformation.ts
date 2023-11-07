import { ClientProps } from 'src';
import { GetShippingInformationQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getShippingInformationParser } from './getShippingInformationParser';

const GetShippingInformation =
    (clientProps: ClientProps) =>
    (resolverProps: GetShippingInformationQueryVariables = { cartId: '' }) => {
        const { restClient } = clientProps;
        const { cartId } = resolverProps;
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                if (cartId) {
                    const {data: rawData} = await restClient(
                        `/api/v3/checkouts/${cartId}`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );

                    setData(getShippingInformationParser(rawData));
                };
                setLoading(false);
            };
            fetchData();
        }, [])

        return { data, loading };
    };

export default GetShippingInformation;
