import { ClientProps } from 'src';
import { GetSelectedAndAvailableShippingMethodsQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getSelectedAndAvailableShippingMethodsParser } from './getSelectedAndAvailableShippingMethodsParser';

const GetSelectedAndAvailableShippingMethods =
    (clientProps: ClientProps) => (resolverProps: GetSelectedAndAvailableShippingMethodsQueryVariables) => {
        const { restClient } = clientProps;
        const { cartId } = resolverProps;
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                if (cartId) {
                    let countries = [];
                    let regions = [];
                    const { data: checkoutData } = await restClient(
                        `/api/v3/checkouts/${cartId}?include=consignments.available_shipping_options`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );

                    for (const cons of checkoutData.consignments) {
                        const country = await restClient(
                            `/api/v2/countries?country_iso2=${cons.shipping_address.country_code}`,
                            {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            }
                        );
                        countries.push(country[0].country);
                        const state = await restClient(
                            `/api/v2/countries/${country[0].id}/states?state_abbreviation=${cons.shipping_address.state_or_province_code}`,
                            {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            }
                        );
                        regions.push(state[0].id)
                    }

                    setData(getSelectedAndAvailableShippingMethodsParser(checkoutData, countries, regions));
                }
                setLoading(false);
            };
            fetchData();
        }, []);

        return { data, loading };
    };

export default GetSelectedAndAvailableShippingMethods;
