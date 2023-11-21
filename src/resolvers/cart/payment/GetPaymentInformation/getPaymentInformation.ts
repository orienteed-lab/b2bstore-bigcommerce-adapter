import { ClientProps } from 'src';
import { GetPaymentInformationQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getPaymentInformationParser } from './getPaymentInformationParser';

const GetPaymentInformation = (clientProps: ClientProps) => (resolverProps: GetPaymentInformationQueryVariables) => {
    const { restClient } = clientProps;
    const { cartId } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (cartId) {
                try {
                    const { data: checkoutData } = await restClient(`/api/v3/checkouts/${cartId}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });
                    const orderData = await restClient(`/api/v2/orders?cart_id=${cartId}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });
                    const { data: paymentsData } = await restClient(`/api/v3/payments/methods?order_id=${orderData[0].id}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });
                    setData(getPaymentInformationParser(checkoutData, orderData[0], paymentsData));
                } catch {
                    const { data: checkoutData } = await restClient(
                        `/api/v3/checkouts/${cartId}?include=consignments.available_shipping_options`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );
                    await restClient(`/api/v3/checkouts/${cartId}/billing-address/${checkoutData.billing_address.id}`, {
                        method: 'PUT',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        },
                        body: JSON.stringify(checkoutData.consignments[0].address)
                    });

                    await restClient(`/api/v3/checkouts/${cartId}/consignments/${checkoutData.consignments[0].id}`, {
                        method: 'PUT',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        },
                        body: JSON.stringify({ shipping_option_id: checkoutData.consignments[0].available_shipping_options[0].id })
                    });

                    const { data: order } = await restClient(`/api/v3/checkouts/${cartId}/orders`, {
                        method: 'POST',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    const { data: paymentsData } = await restClient(`/api/v3/payments/methods?order_id=${order.id}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });
                    setData(getPaymentInformationParser(checkoutData, {}, paymentsData));
                }
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading };
};

export default GetPaymentInformation;
