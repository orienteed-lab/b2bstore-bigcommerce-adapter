import { GetCustomerOrdersQuery } from '@schema';

export const getCustomerOrdersParser = (data: any, filter: any, ordersProducts: any): GetCustomerOrdersQuery => {
    const getShipments = (order) => {
        const shipments = [];

        order.consignments.map((cons) =>
            cons.shipping.length !== 0 && order.status === 'Shipped'
                ? cons.shipping.map((ship) =>
                      shipments.push({
                          id: ship.id.toString(),
                          tracking: [] // TODO_B2B: See if tracking number can be obtained
                      })
                  )
                : []
        );

        return shipments;
    };

    const getUrl = (orderId, productId) => {
        const url = ordersProducts.find((order) => order.orderId == orderId).items.find((item) => item.productId == productId).urlKey;

        return url;
    };

    const getItems = (order) => {
        const items = [];

        for (const element of order.consignments) {
            if (element.pickups.length !== 0) {
                element.pickups.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            id: item.product_id.toString(),
                            product_name: item.name,
                            product_sale_price: {
                                currency: order.currency_code,
                                value: Number(item.total_inc_tax)
                            },
                            discounts:
                                item.applied_discounts.length !== 0
                                    ? item.applied_discounts.map((discount) => ({
                                          amount: {
                                              currency: order.currency_code,
                                              value: Number(discount.amount)
                                          },
                                          label: discount.name,
                                          __typename: 'Discount'
                                      }))
                                    : [],
                            product_sku: item.sku,
                            product_url_key: getUrl(order.id, item.product_id),
                            selected_options:
                                item.product_options.length !== 0
                                    ? item.product_options.map((option) => ({
                                          label: option.display_name,
                                          value: option.display_value
                                      }))
                                    : [],
                            quantity_ordered: item.quantity
                        })
                    )
                );
            }

            if (element.shipping.length !== 0) {
                element.shipping.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            id: item.product_id.toString(),
                            product_name: item.name,
                            product_sale_price: {
                                currency: order.currency_code,
                                value: Number(item.total_inc_tax)
                            },
                            discounts:
                                item.applied_discounts.length !== 0
                                    ? item.applied_discounts.map((discount) => ({
                                          amount: {
                                              currency: order.currency_code,
                                              value: Number(discount.amount)
                                          },
                                          label: discount.name,
                                          __typename: 'Discount'
                                      }))
                                    : [],
                            product_sku: item.sku,
                            product_url_key: getUrl(order.id, item.product_id),
                            selected_options:
                                item.product_options.length !== 0
                                    ? item.product_options.map((option) => ({
                                          label: option.display_name,
                                          value: option.display_value
                                      }))
                                    : [],
                            quantity_ordered: item.quantity
                        })
                    )
                );
            }

            if (element.downloads.length !== 0) {
                element.downloads.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            id: item.product_id.toString(),
                            product_name: item.name,
                            product_sale_price: {
                                currency: order.currency_code,
                                value: Number(item.total_inc_tax)
                            },
                            discounts:
                                item.applied_discounts.length !== 0
                                    ? item.applied_discounts.map((discount) => ({
                                          amount: {
                                              currency: order.currency_code,
                                              value: Number(discount.amount)
                                          },
                                          label: discount.name,
                                          __typename: 'Discount'
                                      }))
                                    : [],
                            product_sku: item.sku,
                            product_url_key: getUrl(order.id, item.product_id),
                            selected_options:
                                item.product_options.length !== 0
                                    ? item.product_options.map((option) => ({
                                          label: option.display_name,
                                          value: option.display_value
                                      }))
                                    : [],
                            quantity_ordered: item.quantity
                        })
                    )
                );
            }
        }

        return items;
    };

    const getOrderDate = (bcDate: string) => {
        const day = bcDate.substring(5, 7);
        const monthStr = bcDate.substring(8, 11);
        const year = bcDate.substring(12, 16);
        const time = bcDate.substring(17, 25);
        let monthNum;

        switch (monthStr) {
            case 'Jan':
                monthNum = '01';
                break;
            case 'Feb':
                monthNum = '02';
                break;
            case 'Mar':
                monthNum = '03';
                break;
            case 'Apr':
                monthNum = '04';
                break;
            case 'May':
                monthNum = '05';
                break;
            case 'Jun':
                monthNum = '06';
                break;
            case 'Jul':
                monthNum = '07';
                break;
            case 'Aug':
                monthNum = '08';
                break;
            case 'Sep':
                monthNum = '09';
                break;
            case 'Oct':
                monthNum = '10';
                break;
            case 'Nov':
                monthNum = '11';
                break;
            case 'Dec':
                monthNum = '12';
                break;
        }

        return `${year}-${monthNum}-${day} ${time}`;
    };

    const getOrders = () => {
        const shownOrders = filter !== '' ? data.filter((order) => (order.id + '').indexOf(filter) > -1) : data;
        const total_count = shownOrders.length;

        return {
            items: shownOrders.map((order) => ({
                comment: order.customer_message,
                external_order_number: order.external_order_id,
                mp_delivery_information: {
                    mp_delivery_comment: '',
                    mp_delivery_date: '',
                    mp_delivery_time: '',
                    mp_house_security_code: '',
                    __typename: 'MpDeliveryInformationOutput'
                },
                store_id: order.channel_id,
                billing_address: {
                    city: order.billing_address.city,
                    country_code: order.billing_address.country_iso2,
                    firstname: order.billing_address.first_name,
                    lastname: order.billing_address.last_name,
                    postcode: order.billing_address.zip,
                    region: order.billing_address.state,
                    street: [order.billing_address.street_1],
                    telephone: order.billing_address.phone
                },
                id: order.id.toString(),
                invoices:
                    order.consignments[0].shipping.length !== 0
                        ? order.consignments[0].shipping.map((ship) => ({
                              id: ship.id.toString()
                          }))
                        : [],
                items: getItems(order),
                number: order.id.toString(),
                order_date: getOrderDate(order.date_created),
                payment_methods: [
                    {
                        name: order.payment_method,
                        type: order.payment_method,
                        additional_data: []
                    }
                ],
                shipments: getShipments(order),
                shipping_address: {
                    city: order.consignments[0].shipping[0].city,
                    country_code: order.consignments[0].shipping[0].country_iso2,
                    firstname: order.consignments[0].shipping[0].first_name,
                    lastname: order.consignments[0].shipping[0].last_name,
                    postcode: order.consignments[0].shipping[0].zip,
                    region: order.consignments[0].shipping[0].state,
                    street: [order.consignments[0].shipping[0].street_1],
                    telephone: order.consignments[0].shipping[0].phone
                },
                shipping_method: order.consignments[0].shipping[0].shipping_method,
                status: order.status === 'Completed' ? 'Complete' : order.status === 'Cancelled' ? 'Cancelled' : order.status,
                total: {
                    discounts: [
                        {
                            amount: {
                                currency: order.currency_code,
                                value: Number(order.discont_amuont)
                            }
                        }
                    ],
                    grand_total: {
                        currency: order.currency_code,
                        value: Number(order.total_inc_tax)
                    },
                    subtotal: {
                        currency: order.currency_code,
                        value: Number(order.subtotal_inc_tax)
                    },
                    total_shipping: {
                        currency: order.currency_code,
                        value: Number(order.shipping_cost_inc_tax)
                    },
                    total_tax: {
                        currency: order.currency_code,
                        value: Number(order.total_tax)
                    }
                }
            })),
            page_info: {
                current_page: 1,
                total_pages: 1
            },
            total_count: total_count
        };
    };

    return {
        customer: {
            id: data[0].customer_id,
            orders: getOrders()
        }
    };
};
