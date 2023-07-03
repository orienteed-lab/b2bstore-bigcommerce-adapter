import { GetCurrencyDataQuery } from '@schema';

export const getCurrencyDataParser = (currencyData: any, isDefault: any): GetCurrencyDataQuery => {
    return {
        currency: {
            current_currency_code: currencyData.site.currencies.edges.find((currency) => currency.node.isActive === true).node.code,
            default_display_currency_code: isDefault.find((currency) => currency.is_default === true).currency_code,
            available_currency_codes: currencyData.site.currencies.edges.map((currency) => currency.node.code)
        }
    };
};
