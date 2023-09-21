import { GetPriceSummaryQuery } from '@schema';

export const getPriceSummaryParser = ({ data }: any): GetPriceSummaryQuery => {
    const getItems = () => {
        const items = [];

        if (data.cart.line_items.physical_items.length !== 0) {
            data.cart.line_items.physical_items.map((item) =>
                items.push({
                    uid: item.product_id,
                    quantity: item.quantity
                })
            );
        }

        if (data.cart.line_items.digital_items.length !== 0) {
            data.cart.line_items.digital_items.map((item) =>
                items.push({
                    uid: item.product_id,
                    quantity: item.quantity
                })
            );
        }

        if (data.cart.line_items.custom_items.length !== 0) {
            data.cart.line_items.custom_items.map((item) =>
                items.push({
                    uid: item.id,
                    quantity: item.quantity
                })
            );
        }

        return items;
    };

    const getDiscounts = () => {
        const discounts = [];

        if (data.coupons.length !== 0) {
            data.coupons.map((coupon) =>
                discounts.push({
                    // TODO_B2B: See if this includes coupons and discounts
                    amount: {
                        currency: data.cart.currency.code,
                        value: coupon.discounted_amount
                    },
                    label: coupon.code
                })
            );
        }

        if (data.cart.discounts.length !== 0) {
            data.cart.discounts.map((dis) =>
                discounts.push({
                    amount: {
                        currency: data.cart.currency.code,
                        value: dis.discounted_amount
                    },
                    label: 'Store Discount'
                })
            );
        }

        return discounts;
    };

    return {
        cart: {
            id: '',
            items: getItems(),
            shipping_addresses: [
                {
                    selected_shipping_method: {
                        amount: {
                            currency: data.cart.currency.code,
                            value: data.shipping_cost_total_inc_tax
                        }
                    },
                    street: [data.billing_address.address1]
                }
            ],
            prices: {
                applied_taxes: data.taxes.map((tax) => ({
                    amount: {
                        currency: data.cart.currency.code,
                        value: tax.amount
                    }
                })),
                discounts: getDiscounts(),
                grand_total: {
                    currency: data.cart.currency.code,
                    value: data.grand_total
                },
                subtotal_excluding_tax: {
                    currency: data.cart.currency.code,
                    value: data.subtotal_ex_tax
                },
                subtotal_including_tax: {
                    currency: data.cart.currency.code,
                    value: data.subtotal_inc_tax
                },
                gift_options: {
                    printed_card: {
                        currency: data.cart.currency.code,
                        value: 0 // TODO_B2B: Search what is this
                    }
                }
            },
            applied_gift_cards: [
                // TODO_B2B: See if it's possible. Gift cretificates can only be viewed in an order
                {
                    code: '',
                    applied_balance: {
                        currency: data.cart.currency.code,
                        value: 0
                    }
                }
            ]
        }
    };
};
