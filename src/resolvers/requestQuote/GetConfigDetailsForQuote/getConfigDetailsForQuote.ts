import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

const GetConfigDetailsForQuote = (clientProps: ClientProps) => () => {
    const { restClient } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const quotes = await restClient(`/api/v3/io/rfq`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerceb2b'
                }
            });
            if (quotes.code === 200) {
                setData(quotes.data);
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading };
};

export default GetConfigDetailsForQuote;
