import { ClientProps } from 'src';
import { getCustomerInformationParser } from './getCustomerInformationParser';
import DEFAULT_OPERATIONS from './getCustomerInformation.gql';
import { useCallback, useEffect, useState } from 'react';

interface GetCustomerInformationProps {
    isAwait?: boolean;
    isSignedIn?: boolean;
}
const GetCustomerInformation =
    (clientProps: ClientProps) =>
    (resolverProps: GetCustomerInformationProps = { isAwait: false, isSignedIn: true }) => {
        const { useAwaitQuery, mergeOperations, restClient } = clientProps;
        const { isAwait, isSignedIn } = resolverProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getCustomerInformationQuery } = operations;

        const [loading, setLoading] = useState(!isAwait);
        const [data, setData] = useState(undefined);
        const [error, setError] = useState(undefined);
        const performQuery = useAwaitQuery(getCustomerInformationQuery);

        useEffect(() => {
            if (!isAwait) {
                const getInformation = async () => {
                    setLoading(true);
                    try {
                        if (isSignedIn || isSignedIn === null) {
                            const { data: dataCustomer } = await performQuery({
                                context: {
                                    headers: {
                                        backendTechnology: ['bigcommerce']
                                    }
                                }
                            });

                            const { data: shippingData } = await restClient(
                                `/api/v3/customers?include=addresses&email:in=${dataCustomer.customer.email}`,
                                {
                                    method: 'GET',
                                    headers: {
                                        backendTechnology: 'bigcommerce'
                                    }
                                }
                            );

                            const { data: rawData } = await restClient(
                                `/api/v3/customers/subscribers/?email:in=${dataCustomer.customer.email}`,
                                {
                                    method: 'GET',
                                    headers: {
                                        backendTechnology: 'bigcommerce'
                                    }
                                }
                            );

                            setData(getCustomerInformationParser(dataCustomer, rawData, shippingData));
                        }
                    } catch (err) {
                        setError(err);
                    }
                    setLoading(false);
                };
                getInformation();
            }
        }, []);

        if (isAwait) {

            const fetchUserDetails = useCallback(async () => {
                setLoading(true);
                let dataFetch = undefined;
                try {
                    const { data: dataCustomer } = await performQuery({
                        context: {
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        }
                    });

                    const { data: shippingData } = await restClient(
                        `/api/v3/customers?include=addresses&email:in=${dataCustomer.customer.email}`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );

                    const { data: rawData } = await restClient(`/api/v3/customers/subscribers/?email:in=${dataCustomer.customer.email}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    dataFetch = getCustomerInformationParser(dataCustomer, rawData, shippingData);
                    setData(dataFetch);
                } catch (err) {
                    setError(err);
                }
                setLoading(false);
                return { data: dataFetch };
            }, []);

            return fetchUserDetails;
        } else {
            return { loading, error, data };
        }
    };

export default GetCustomerInformation;
