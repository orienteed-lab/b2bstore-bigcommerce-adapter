import { ClientProps } from 'src';
import { useEffect, useState } from 'react';

import { getCustomerAddressesForAddressBookParser } from './getCustomerAddressesForAddressBookParser';
import DEFAULT_OPERATIONS from './getCustomerAddressesForAddressBook.gql';

interface GetCustomerAddressesForAddressBook {
    isSignedIn: boolean;
}

const GetCustomerAddressesForAddressBook =
    (clientProps: ClientProps) =>
    (resolverProps: GetCustomerAddressesForAddressBook = { isSignedIn: true }) => {
        const { restClient, useAwaitQuery, mergeOperations } = clientProps;
        const { isSignedIn } = resolverProps;

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [parsedData, setParsedData] = useState<any>(undefined);
        const regionsData = [];

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getCustomerAddressesForAddressBookQuery } = operations;

        const getCustomerAddresses = useAwaitQuery(getCustomerAddressesForAddressBookQuery);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                if (isSignedIn) {
                    try {
                        const { data } = await getCustomerAddresses({
                            context: {
                                headers: {
                                    backendTechnology: ['bigcommerce']
                                }
                            }
                        });
                        const customer = data.customer.entityId;
                        const countriesData = await restClient(`/api/v2/countries?limit=250`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });
                        const rawData = await restClient(`/api/v3/customers/addresses?customer_id:in=${customer}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });
                        // rawData.data.map(async (address) => {
                        //     const country = countriesData.filter((country) => country.country_iso2 === address.country_code);
                        //     const states = await restClient(`/api/v2/countries/${country[0].id}/states`, {
                        //         method: 'GET',
                        //         headers: {
                        //             backendTechnology: 'bigcommerce'
                        //         }
                        //     });
                        //     const state = states.filter((region) => region.state === address.state_or_province);
                        //     regionsData.push(state[0]);
                        // });
                        setParsedData(getCustomerAddressesForAddressBookParser(rawData.data, countriesData, regionsData));
                    } catch (err) {
                        setError(err);
                    }
                }
                setLoading(false);
            };
            fetchData();
        }, []);

        return { data: parsedData, loading, error };
    };

export default GetCustomerAddressesForAddressBook;
