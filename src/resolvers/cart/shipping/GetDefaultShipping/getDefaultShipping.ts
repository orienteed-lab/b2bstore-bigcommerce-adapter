import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getDefaultShipping.gql';
import { getDefaultShippingParser } from './getDefaultShippingParser';

interface GetDefaultShippingProps {
    isSignedIn?: boolean;
}

const GetDefaultShipping =
    (clientProps: ClientProps) =>
    (resolverProps: GetDefaultShippingProps = { isSignedIn: false }) => {
        const { mergeOperations, restClient, useAwaitQuery } = clientProps;
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

                    const {data: rawData} = await restClient(
                        `/api/v3/customers/addresses?customer_id:in=${customerData.customer.entityId}`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );
                    setData(getDefaultShippingParser(rawData));
                }
                setLoading(false);
            };
            fetchData();
        }, []);

        return { data, loading };
    };

export default GetDefaultShipping;
