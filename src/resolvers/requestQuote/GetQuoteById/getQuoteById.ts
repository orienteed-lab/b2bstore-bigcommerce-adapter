import { ClientProps } from 'src';
import { GetQuoteByIdQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getQuoteByIdParser } from './getQuoteByIdParser';

const GetQuoteById = (clientProps: ClientProps) => (resolverProps: GetQuoteByIdQueryVariables) => {
    const { restClient } = clientProps;
    const { quote_id } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const {data: rawData} = await restClient(`/api/v3/io/rfq/${quote_id}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerceb2b'
                }
            });

            setData(getQuoteByIdParser(rawData, quote_id));
            setLoading(false);
        };
        fetchData();
    }, [])

    return { data, loading };
};

export default GetQuoteById;
