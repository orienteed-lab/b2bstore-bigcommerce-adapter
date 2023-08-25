import { ClientProps } from 'src';
import { GetCustomerOrdersQueryVariables } from '@schema';
import { getCustomerOrdersParser } from './getCustomerOrdersParser';

import DEFAULT_OPERATIONS from './getCustomerOrders.gql';
import { useEffect, useState } from 'react';

const GetCustomerOrders =
    (clientProps: ClientProps) =>
    (resolverProps: GetCustomerOrdersQueryVariables = { pageSize: 10, filter: { number: { match: '' } } }) => {
        const { mergeOperations, useAwaitQuery, restClient } = clientProps;
        const { pageSize, filter } = resolverProps;
        const [data, setData] = useState(undefined);
        const [error, setError] = useState(undefined);
        const [loading, setLoading] = useState(true);

        const { getCustomerIdQuery, getProductPathQuery } = mergeOperations(DEFAULT_OPERATIONS);
        const getCustomer = useAwaitQuery(getCustomerIdQuery);
        const getProductPath = useAwaitQuery(getProductPathQuery);

        useEffect(() => {
            const getUrlPath = async (rawData) => {
                let ordersProducts = [];

                for (const order of rawData) {
                    for (const element of order.consignments) {
                        if (element.pickups.length !== 0) {
                            element.pickups.map((ele) =>
                                ordersProducts.push({
                                    orderId: order.id,
                                    items: ele.line_items.map((item) => ({ productId: item.product_id, urlKey: null }))
                                })
                            );
                        }

                        if (element.shipping.length !== 0) {
                            element.shipping.map((ele) =>
                                ordersProducts.find((o) => o.orderId === order.id)
                                    ? ele.line_items.map((item) =>
                                          ordersProducts
                                              .find((o) => o.orderId === order.id)
                                              .items.push({ productId: item.product_id, urlKey: null })
                                      )
                                    : ordersProducts.push({
                                          orderId: order.id,
                                          items: ele.line_items.map((item) => ({ productId: item.product_id, urlKey: null }))
                                      })
                            );
                        }

                        if (element.downloads.length !== 0) {
                            element.downloads.map((ele) =>
                                ordersProducts.find((o) => o.orderId === order.id)
                                    ? ele.line_items.map((item) =>
                                          ordersProducts
                                              .find((o) => o.orderId === order.id)
                                              .items.push({ productId: item.product_id, urlKey: null })
                                      )
                                    : ordersProducts.push({
                                          orderId: order.id,
                                          items: ele.line_items.map((item) => ({ productId: item.product_id, urlKey: null }))
                                      })
                            );
                        }
                    }
                }

                for (const order of ordersProducts) {
                    for (const item of order.items) {
                        const { data: urlData } = await getProductPath({
                            context: {
                                headers: {
                                    backendTechnology: ['bigcommerce']
                                }
                            },
                            variables: {
                                id: item.productId
                            }
                        });

                        ordersProducts.find((o) => o.orderId === order.orderId).items.find((i) => i.productId === item.productId).urlKey =
                            urlData.site.product.path;
                    }
                }

                return { ordersProducts };
            };

            const getCustomerOrders = async () => {
                setLoading(true);
                const { data: customerData } = await getCustomer({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });

                const rawData = await restClient(
                    `/api/v2/orders/?customer_id=${customerData.customer.entityId}&limit=${pageSize}&include=consignments.line_items`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );

                const { ordersProducts } = await getUrlPath(rawData);

                setData(getCustomerOrdersParser(rawData, filter.number.match, ordersProducts));
                setLoading(false);
            };
            getCustomerOrders();
        }, []);

        return { data, loading, error };
    };

export default GetCustomerOrders;
