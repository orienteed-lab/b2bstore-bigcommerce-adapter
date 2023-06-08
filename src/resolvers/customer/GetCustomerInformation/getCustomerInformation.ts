import { ClientProps } from 'src';
import { GetCustomerInformationQueryVariables } from '@schema';
import { getCustomerInformationParser } from './getCustomerInformationParser';
import DEFAULT_OPERATIONS from './getCustomerInformation.gql';
import { useCallback, useEffect, useState } from 'react';
import { parse } from 'graphql';

interface GetCustomerInformationProps {
    vars: { lazy: boolean };
}
const GetCustomerInformation = (clientProps: ClientProps) => (resolverProps: GetCustomerInformationProps) => {
    const { useAwaitQuery, mergeOperations, restClient } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getCustomerInformationQuery } = operations;
    const { vars } = resolverProps;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [error, setError] = useState();
    const performQuery = useAwaitQuery(getCustomerInformationQuery);

    const customerInformation = useCallback(async () => {
        setLoading(true);
        const { data: dataCustomer } = await performQuery({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        let parsedData = undefined;
        if (dataCustomer) {
            const { data: rawData } = await restClient(`/api/v3/customers/subscribers/?email:in=${dataCustomer.customer.email}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });
            if (rawData) {
                parsedData = getCustomerInformationParser(dataCustomer, rawData);
                setLoading(false);
                setData(parsedData);
            }
        }
        setError(error);
        return { data };
    }, [performQuery, restClient, getCustomerInformationParser]);

    useEffect(() => {
        if (!vars.lazy) {
            customerInformation();
        }
    }, [vars, customerInformation]);

    return { loading, error, data, customerInformation };
};

export default GetCustomerInformation;
