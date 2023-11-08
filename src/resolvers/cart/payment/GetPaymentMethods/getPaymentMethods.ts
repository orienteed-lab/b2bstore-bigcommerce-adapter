import { ClientProps } from 'src';
import { GetPaymentMethodsQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import { getPaymentMethodsParser } from './getPaymentMethodsParser';

const GetPaymentMethods = (clientProps: ClientProps) => (resolverProps: GetPaymentMethodsQueryVariables) => {
    /*
        1. Check if there is and order for that checkout
        YES:
            2. Retrieve that order's payment options
            3. Retrieve the selected payment method if has one, if not the first in the available list is selected
        NO:
            2. Try to create an order. Success?
            YES:
                3. Get payment methods from that order
                4. Retrieve the selected payment method if has one, if not the first in the available list is selected
            NO:
                3. Update billing address
                4. Update shipping_option_id in consignment
                5. Create an order from the checkout
                6. Get payment methods from that order
                7. Retrieve the selected payment method if has one, if not the first in the available list is selected
    */
    const { restClient } = clientProps;
    const { cartId } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (cartId) {
                try {
                    const orderData = await restClient(`/api/v2/orders?cart_id=${cartId}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    const { data: paymentOptions } = await restClient(`/api/v3/payments/methods?order_id=${orderData[0].id}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });

                    setData(getPaymentMethodsParser(paymentOptions, orderData));
                } catch (e) {
                    try {
                        const { data: order } = await restClient(`/api/v3/checkouts/${cartId}/orders`, {
                            method: 'POST',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });

                        const { data: paymentOptions } = await restClient(`/api/v3/payments/methods?order_id=${order.id}`, {
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

                        setData(getPaymentMethodsParser(paymentOptions, orderData));
                    } catch (err) {
                        const { data: checkout } = await restClient(
                            `/api/v3/checkouts/${cartId}?include=consignments.available_shipping_options`,
                            {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            }
                        );

                        await restClient(`/api/v3/checkouts/${cartId}/billing-address/${checkout.billing_address.id}`, {
                            method: 'PUT',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            },
                            body: JSON.stringify(checkout.consignments[0].address)
                        });

                        await restClient(`/api/v3/checkouts/${cartId}/consignments/${checkout.consignments[0].id}`, {
                            method: 'PUT',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            },
                            body: JSON.stringify({ shipping_option_id: checkout.consignments[0].available_shipping_options[0].id })
                        });

                        const { data: order } = await restClient(`/api/v3/checkouts/${cartId}/orders`, {
                            method: 'POST',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        });

                        const { data: paymentOptions } = await restClient(`/api/v3/payments/methods?order_id=${order.id}`, {
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

                        setData(getPaymentMethodsParser(paymentOptions, orderData));
                    }
                }
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return { data, loading };
};

export default GetPaymentMethods;
