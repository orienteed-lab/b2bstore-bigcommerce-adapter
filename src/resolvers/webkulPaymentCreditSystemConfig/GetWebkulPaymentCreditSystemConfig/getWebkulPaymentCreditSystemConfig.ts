import { useEffect, useState } from 'react';
import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './getWebkulPaymentCreditSystemConfig.gql';
import { getWebkulPaymentCreditSystemConfigParser } from './getWebkulPaymentCreditSystemConfigParser';

interface GetWebkulPaymentCreditSystemConfigProps {
    cartId: string;
}

const GetWebkulPaymentCreditSystemConfig =
    (clientProps: ClientProps) =>
    (resolverProps: GetWebkulPaymentCreditSystemConfigProps = { cartId: '' }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { cartId } = resolverProps;
        const [data, setData] = useState(undefined);
        const [loading, setLoading] = useState(true);

        const { getWebkulPaymentCreditSystemConfigQuery } = mergeOperations(DEFAULT_OPERATIONS);
        const getCredit = useAwaitQuery(getWebkulPaymentCreditSystemConfigQuery);

        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);

                const orderData = await restClient(`/api/v2/orders?cart_id=${cartId}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                const { data: creditData } = await getCredit({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });

                setData(getWebkulPaymentCreditSystemConfigParser(creditData, orderData[0]));
                setLoading(false);
            };
            fetchData();
        }, []);

        return { data, loading };
    };

export default GetWebkulPaymentCreditSystemConfig;
