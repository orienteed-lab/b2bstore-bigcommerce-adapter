import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getSavedPayments.gql';
import { getSavedPaymentsParser } from './getSavedPaymentsParser';

interface SavedPaymentsProps {
    isSignedIn: boolean;
}

const GetSavedPayments = (clientProps: ClientProps) => (resolverProps: SavedPaymentsProps) => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const { isSignedIn } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCustomer = useAwaitQuery(getCustomerIdQuery);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (isSignedIn) {
                const { data: customerData } = await getCustomer({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });

                const savedPayments = await restClient(`/api/v3/customers/${customerData.customer.entityId}/stored-instruments`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                setData(getSavedPaymentsParser(savedPayments));
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading };
};

export default GetSavedPayments;
