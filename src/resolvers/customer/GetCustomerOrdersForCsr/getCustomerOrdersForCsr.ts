import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getCustomerOrdersForCsr.gql';
import { getCustomerOrdersForCsrParser } from './getCustomerOrdersForCsrParser';

const GetCustomerOrdersForCsr = (clientProps: ClientProps) => () => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;

    const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getCustomer = useAwaitQuery(getCustomerIdQuery);

    const fetchCustomerOrders = async () => {
        let parsedData = undefined;

        const { data: customerData } = await getCustomer({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        const response = await restClient(`/api/v2/orders?customer_id=${customerData.customer.entityId}&include=consignments.line_items`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        parsedData = getCustomerOrdersForCsrParser(response);

        return { data: parsedData };
    };

    return fetchCustomerOrders;
};

export default GetCustomerOrdersForCsr;
