import { ClientProps } from 'src';
import { GetRegionsQueryVariables } from '@schema';

import { getRegionsParser } from './getRegionsParser';
import { useEffect, useState } from 'react';

const GetRegions =
    (clientProps: ClientProps) =>
    (resolverProps: GetRegionsQueryVariables = { countryCode: null }) => {
        const { restClient } = clientProps;
        const { countryCode: country_iso2 } = resolverProps;

        const [loading, setLoading] = useState(true);
        const [data, setData] = useState(undefined);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                if (country_iso2) {
                    try {
                        const country = await restClient(`/api/v2/countries?country_iso2=${country_iso2}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });
                        const rawData = await restClient(`/api/v2/countries/${country[0].id}/states`, { // Will return a warning message if there is no region data
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });
                        setData(getRegionsParser(rawData));
                    } catch (err) {
                        setData(getRegionsParser(null)); // This means taht there is no region data for that country
                    }
                    setLoading(false);
                }
            };
            fetchData();
        }, [country_iso2]);

        return { data, loading };
    };

export default GetRegions;
