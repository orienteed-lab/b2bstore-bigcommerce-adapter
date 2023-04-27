import { ClientProps } from 'src';
import { useEffect, useState } from 'react';

import { getCustomerAddressesForAddressBookParser } from './getCustomerAddressesForAddressBookParser';
import DEFAULT_OPERATIONS from './getCustomerAddressesForAddressBook.gql';

const GetCustomerAddressesForAddressBook = (clientProps: ClientProps) => () => {
    const { restClient, useQuery, mergeOperations } = clientProps;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState<any>(undefined);
    let regionsData = [];

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCustomerAddressesForAddressBookQuery } = operations;

    const {
        data,
        loading: customerLoading,
        error: customerError
    } = useQuery(getCustomerAddressesForAddressBookQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    useEffect(() => {
        if (!customerLoading && !customerError && data) {
            const customer = data.customer.entityId;
            const fetchData = async () => {
                setLoading(true);
                restClient(`/api/v2/countries?limit=250`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                })
                    .then((countriesData) => {
                        restClient(`/api/v3/customers/addresses?customer_id:in=${customer}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }).then((rawData) => {
                            rawData.data.map((address) => {
                                const country = countriesData.filter((country) => country.country_iso2 === address.country_code);
                                restClient(`/api/v2/countries/${country[0].id}/states`, {
                                    method: 'GET',
                                    headers: {
                                        backendTechnology: 'bigcommerce'
                                    }
                                })
                                    .then((states) => {
                                        const state = states.filter((region) => region.state === address.state_or_province);
                                        regionsData.push(state[0]);

                                        if (rawData && regionsData.length != 0) {
                                            // try {
                                            setParsedData(
                                                getCustomerAddressesForAddressBookParser(rawData.data, countriesData, regionsData)
                                            );
                                            // } catch (e) {
                                            //     console.error(e);
                                            // }
                                        }
                                    })
                                    .finally(() => {
                                        setLoading(false);
                                    });
                            });
                        });
                    })
                    .catch((err) => {
                        setError(err);
                    });
            };
            fetchData();
        }
    }, []);

    return { data: parsedData, loading, error };
};

export default GetCustomerAddressesForAddressBook;
