import { GetWebkulPaymentCreditSystemConfigQuery } from '@schema';

export const getWebkulPaymentCreditSystemConfigParser = (data: any, orderData: any): GetWebkulPaymentCreditSystemConfigQuery => {
    const remainingCredit = data.customer.storeCredit[0].value;
    return {
        WebkulPaymentCreditsystemConfig: {
            currencysymbol: remainingCredit
                .toLocaleString('en-US', { style: 'currency', currency: data.customer.storeCredit[0].currencyCode })
                .substring(0, 1),
            getcurrentcode: data.customer.storeCredit[0].currencyCode,
            grand_total: orderData.total_inc_tax,
            grand_total_formatted: orderData.total_inc_tax.toLocaleString('en-US', {
                style: 'currency',
                currency: data.customer.storeCredit[0].currencyCode
            }),
            leftincredit: (remainingCredit - orderData.total_inc_tax).toLocaleString('en-US', {
                style: 'currency',
                currency: data.customer.storeCredit[0].currencyCode
            }),
            remainingcreditcurrentcurrency: remainingCredit,
            remainingcreditformatted: remainingCredit.toLocaleString('en-US', {
                style: 'currency',
                currency: data.customer.storeCredit[0].currencyCode
            })
        }
    };
};
