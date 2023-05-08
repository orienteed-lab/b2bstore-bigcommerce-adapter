import { ClientProps } from 'src';
import { GetCountriesQueryVariables } from '@schema';

import { getCountriesParser } from './getCountriesParser';
import { useEffect, useState } from 'react';

const GetCountries = (clientProps: ClientProps) => (resolverProps: GetCountriesQueryVariables) => {
    const { restClient, useQuery, mergeOperations } = clientProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

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
                setData(rawData);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getCountriesParser(data);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    return { data: parsedData, loading, error };
    // return { data, loading, error};
};

export default GetCountries;
