import { ClientProps } from 'src';

import { getCountriesParser } from './getCountriesParser';
import { useEffect, useState } from 'react';

const GetCountries = (clientProps: ClientProps) => () => {
    const { restClient } = clientProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await restClient(`/api/v2/countries?limit=250`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });
                setData(getCountriesParser(rawData));
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading, error };
};

export default GetCountries;
