import { GetCustomerOrdersForCsrQuery } from '@schema';

export const getCustomerOrdersForCsrParser = (data: any): GetCustomerOrdersForCsrQuery => {
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

    const getItems = (order) => {
        const items = [];

        for (const element of order.consignments) {
            if (element.pickups.length !== 0) {
                element.pickups.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            __typename: 'OrderItem',
                            product_sku: item.sku
                        })
                    )
                );
            }

            if (element.shipping.length !== 0) {
                element.shipping.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            __typename: 'OrderItem',
                            product_sku: item.sku
                        })
                    )
                );
            }

            if (element.downloads.length !== 0) {
                element.downloads.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            __typename: 'DownloadableOrderItem',
                            product_sku: item.sku
                        })
                    )
                );
            }
            if (element.email.gift_certificates.length !== 0) {
                element.email.gift_certificates.map((ele) =>
                    ele.line_items.map((item) =>
                        items.push({
                            __typename: 'GiftCardOrderItem',
                            product_sku: item.name
                        })
                    )
                );
            }
        }

        return items;
    };

    return {
        customer: {
            orders: {
                items: data.map((order) => ({
                    number: order.id,
                    order_date: getOrderDate(data.date_created),
                    status: data.status,
                    total: {
                        grand_total: {
                            currency: data.currency_code,
                            value: data.total_inc_tax
                        }
                    },
                    items: getItems(order)
                }))
            }
        }
    };
};
