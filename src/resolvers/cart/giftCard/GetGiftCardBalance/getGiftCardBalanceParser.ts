import { GetGiftCardBalanceQuery } from '@schema';

export const getGiftCardBalanceParser = (data: any): GetGiftCardBalanceQuery => {
    const getDate = (bcDate) => {
        let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(bcDate);

        return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    };

    return {
        giftCardAccount: {
            balance: {
                currency: data.currency_code,
                value: data.balance
            },
            code: data.code,
            expiration_date: data.expiry_date !== '0' ? getDate(data.expiry_date) : data.expiry_date,
            id: data.code
        }
    };
};
