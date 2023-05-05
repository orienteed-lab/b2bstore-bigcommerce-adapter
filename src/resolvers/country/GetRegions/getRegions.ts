import { ClientProps } from 'src';
import { GetCountriesQueryVariables, GetRegionsQueryVariables } from '@schema';

import { getRegionsParser } from './getRegionsParser';
import { useEffect, useState } from 'react';

interface GetRegionsProps {
    variables: GetRegionsQueryVariables;
}

const GetRegions = (clientProps: ClientProps) => (resolverProps: GetRegionsProps) => {
    const { restClient, useQuery, mergeOperations } = clientProps;
    const {
        variables: { countryCode: country_iso2 }
    } = resolverProps;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (country_iso2) {
                setLoading(true);
                    restClient(`/api/v2/countries?country_iso2=${country_iso2}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }).then((country) => {
                        restClient(`/api/v2/countries/${country[0].id}/states`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }).then((rawData) => {
                            setData(rawData)
                        });
                    }).catch((err) => {
                        setError(err);
                    }).finally(() => {
                        setLoading(false);
                    });
            }
        };
        fetchData();
    }, [country_iso2]);

    let parsedData = undefined;
    if (data) {
        // try {
        parsedData = getRegionsParser(data);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    return { data: parsedData, loading, error };
};

export default GetRegions;
