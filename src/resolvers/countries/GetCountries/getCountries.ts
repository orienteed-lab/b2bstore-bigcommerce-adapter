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
                restClient(
                    `/api/v2/countries/count`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                ).then((n) => {
                    restClient(
                        `/api/v2/countries?limit=${n.count}`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    ).then((rawData) => {
                        setData(rawData);
                    });
                }).catch((err) => {
                    setError(err)
                }).finally(() =>{
                    setLoading(false);
                });
        }
        fetchData();
    }, []);

    console.log('antes del parser', data);

    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getCountriesParser(data);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    console.log('despues del parser', parsedData);


    return { data: parsedData, loading, error};
    // return { data, loading, error};
};

export default GetCountries;
