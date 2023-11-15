import { ClientProps } from 'src';
import { GetShippingMethodsQueryVariables } from '@schema';
import { useEffect, useState } from 'react';

import DEFAULT_OPERTIONS from './getShippingMethods.gql';
import { getShippingMethodsParser } from './getShippingMethodsParser';

const GetShippingMethods =
    (clientProps: ClientProps) =>
    (resolverProps: GetShippingMethodsQueryVariables = { cartId: null }) => {
        const { restClient, mergeOperations, useAwaitQuery } = clientProps;
        const { cartId } = resolverProps;
        const [data, setData] = useState(undefined);

        const { getCustomerIdQuery } = mergeOperations(DEFAULT_OPERTIONS);
        const getCustomer = useAwaitQuery(getCustomerIdQuery);

        useEffect(() => {
            const fetchDtata = async () => {
                if (cartId) {
                    const { data: checkoutData } = await restClient(
                        `/api/v3/checkouts/${cartId}?include=consignments.available_shipping_options`,
                        {
                            method: 'GET',
                            headers: {
                                backendTechnology: 'bigcommerce'
                            }
                        }
                    );
                    if (checkoutData.consignments.length === 0) {
                        const { data: customerData } = await getCustomer({
                            // We assume that the customer is logged in
                            context: {
                                headers: {
                                    backendTechnology: ['bigcommerce']
                                }
                            }
                        });
                        const { data: addressesData } = await restClient(
                            // We assume that the customer has at least one address
                            `/api/v3/customers/addresses?customer_id:in=${customerData.customer.entityId}`,
                            {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            }
                        );
                        const { data: checkoutUpdated } = await restClient(
                            `/api/v3/checkouts/${cartId}/consignments?include=consignments.available_shipping_options`,
                            {
                                method: 'POST',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                },
                                body: JSON.stringify([
                                    {
                                        address: {
                                            first_name: addressesData[0].first_name,
                                            last_name: addressesData[0].last_name,
                                            email: checkoutData.billing_address.email,
                                            company: addressesData[0].company,
                                            address1: addressesData[0].address1,
                                            address2: addressesData[0].address2,
                                            city: addressesData[0].city,
                                            state_or_province: addressesData[0].state_or_province,
                                            country_code: addressesData[0].country_code,
                                            postal_code: addressesData[0].postal_code,
                                            phone: addressesData[0].phone
                                        },
                                        line_items: checkoutData.cart.line_items.physical_items.map((item) => ({
                                            item_id: item.id,
                                            quantity: item.quantity
                                        }))
                                    }
                                ])
                            }
                        );
                        setData(getShippingMethodsParser(checkoutUpdated));
                    } else {
                        setData(getShippingMethodsParser(checkoutData));
                    }
                }
            };
            fetchDtata();
        }, []);

        return { data };
    };

export default GetShippingMethods;
