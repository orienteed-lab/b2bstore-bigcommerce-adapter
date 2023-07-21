import { ClientProps } from 'src';
import { getCustomerSubscriptionParser } from './getCustomerSubscriptionParser';

import DEFAULT_OPERATIONS from './getCustomerSubscription.gql';
import { useEffect, useState } from 'react';

interface GetCustomerSubscriptionInterface {
    isSignedIn?: boolean;
}

const GetCustomerSubscription =
    (clientProps: ClientProps) =>
    (resolverProps: GetCustomerSubscriptionInterface = { isSignedIn: false }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { isSignedIn } = resolverProps;
        const [data, setData] = useState<any>(null);
        const [error, setError] = useState(null);

        const { getCustomerInfoQuery } = mergeOperations(DEFAULT_OPERATIONS);
        const getCustomer = useAwaitQuery(getCustomerInfoQuery);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (isSignedIn) {
                        const { data } = await getCustomer({
                            context: {
                                headers: {
                                    backendTechnology: ['bigcommerce']
                                }
                            }
                        });

                        const rawData = await restClient(`/api/v3/customers/subscribers/?email:in=${data.customer.email}`, {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });

                        setData(getCustomerSubscriptionParser(rawData));
                    }
                } catch (err: any) {
                    setError(err);
                }
            };
            fetchData();
        }, []);

        return { data, error };
    };

export default GetCustomerSubscription;
