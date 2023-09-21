import { ClientProps } from 'src';
import { GetPriceSummaryQueryVariables } from '@schema';

import { getPriceSummaryParser } from './getPriceSummaryParser';
import { useEffect, useState } from 'react';

const GetPriceSummary = (clientProps: ClientProps) => (resolverProps: GetPriceSummaryQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId } = resolverProps;

    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const fetchPriceSummary = async () => {
            setLoading(true);
            if (cartId) {
                try {
                    const rawData = await restClient(`/api/v3/checkouts/${cartId}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    setData(getPriceSummaryParser(rawData));
                } catch (err) {
                    setError(err);
                }
            }
            setLoading(false);
        };
        fetchPriceSummary();
    }, []);

    return { data, loading, error };
};

export default GetPriceSummary;
