import { ClientProps } from 'src';
import { GetSavedCartsQueryVariables } from '@schema';

import DEFAULT_OPERATIONS from './getSavedCarts.gql';
import { getSavedCartsParser } from './getSavedCartsParser';
import { useEffect, useState } from 'react';

const GetSavedCarts = (clientProps: ClientProps) => (resolverProps: GetSavedCartsQueryVariables) => {
    const { mergeOperations, useAwaitQuery, restClient } = clientProps;
    const { currentPage, pageSize } = resolverProps;
    const [data, setData] = useState(undefined);

    const { getUserEmailQuery, getProductAndVariantQuery } = mergeOperations(DEFAULT_OPERATIONS);
    const getEmail = useAwaitQuery(getUserEmailQuery);
    const getProducts = useAwaitQuery(getProductAndVariantQuery);

    const refetch = async ({ pageSize, currentPage }) => {
        const {
            data: {
                customer: { email }
            }
        } = await getEmail({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        const { data: customerData } = await restClient(`/api/v3/io/users?email=${email}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });

        const { data: productLists } = await restClient(
            `/api/v3/io/shopping-list?userId=${customerData[0].id}&limit=${pageSize}&offset=${((currentPage - 1) * 5).toFixed(0)}`,
            {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerceb2b'
                }
            }
        );

        const listsData = await Promise.all(
            productLists.map(async (list) => {
                let products = [];
                const { data: listData } = await restClient(`/api/v3/io/shopping-list/${list.id}`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerceb2b'
                    }
                });

                const { data: productsData } = await getProducts({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    },
                    variables: {
                        productIds: listData.items.map((i) => i.productId),
                        variantIds: listData.items.map((i) => i.variantId)
                    }
                });

                productsData.site.products.edges.map((prod) => {
                    if (prod.node.productOptions.edges.length === 0) {
                        products.push({
                            cart_id: listData.id,
                            cart_item_id: listData.items.find((i) => i.productId == prod.node.entityId).id,
                            product_name: prod.node.name,
                            image: prod.node.images.edges[0].node.urlOriginal,
                            price: prod.node.prices.price.value.toFixed(2),
                            qty: listData.items.find((i) => i.productId == prod.node.entityId).quantity,
                            sku: prod.node.sku,
                            subtotal_converted: (
                                prod.node.prices.price.value * listData.items.find((i) => i.productId == prod.node.entityId).quantity
                            ).toFixed(2)
                        });
                    } else {
                        prod.node.variants.edges.map((variant) => {
                            products.push({
                                cart_id: listData.id,
                                cart_item_id: listData.items.find((i) => i.variantId == variant.node.entityId).id,
                                product_name: prod.node.name,
                                image: variant.node.defaultImage?.urlOriginal || prod.node.images.edges[0].node.urlOriginal,
                                price: variant.node.prices.price.value.toFixed(2),
                                qty: listData.items.find((i) => i.variantId == variant.node.entityId).quantity,
                                sku: variant.node.sku,
                                subtotal_converted: (
                                    variant.node.prices.price.value *
                                    listData.items.find((i) => i.variantId == variant.node.entityId).quantity
                                ).toFixed(2)
                            });
                        });
                    }
                });

                return {
                    ...listData,
                    items: products,
                    currency: productsData.site.products.edges[0].node.prices.price.currencyCode
                };
            })
        );

        setData(getSavedCartsParser(listsData, pageSize, currentPage));
    };

    useEffect(() => {
        refetch({ pageSize, currentPage });
    }, []);

    return { data, refetch };
};

export default GetSavedCarts;
