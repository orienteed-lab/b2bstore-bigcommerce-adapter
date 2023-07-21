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

        const [loading, setLoading] = useState(false);
        const [data, setData] = useState(undefined);
        const [error, setError] = useState(undefined);
        const performQuery = useAwaitQuery(getCustomerInformationQuery);

        const getCustomerInformation = useCallback(async () => {
            setLoading(true);
            try {
                if (isSignedIn) {
                    const { data: dataCustomer } = await performQuery({
                        context: {
                            headers: {
                                backendTechnology: ['bigcommerce']
                            }
                        }
                    });

                    const { data: rawData } = await restClient(`/api/v3/customers/subscribers/?email:in=${dataCustomer.customer.email}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    setData(getCustomerInformationParser(dataCustomer, rawData));
                }
            } catch (err) {
                setError(err);
            }
            setLoading(false);
            return { data };
        }, []);

        useEffect(() => {
            if (!isAwait) {
                getCustomerInformation();
            }
        }, []);

        return { loading, error, data, getCustomerInformation };
    };

export default GetCustomerInformation;
