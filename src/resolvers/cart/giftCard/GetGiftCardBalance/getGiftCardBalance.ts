import { ClientProps } from 'src';
import { GetGiftCardBalanceQueryVariables } from '@schema';
import { useState } from 'react';

import { getGiftCardBalanceParser } from './getGiftCardBalanceParser';

const GetGiftCardBalance = (clientProps: ClientProps) => (resolverProps: GetGiftCardBalanceQueryVariables) => {
    const { restClient } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const checkCardBalance = async ({variables}) => {
        setLoading(true);
        try {
            const response = await restClient(`/api/v2/gift_certificates?code=${variables.giftCardCode}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });
            setData(getGiftCardBalanceParser(response[0]));
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    }

    return { balanceResult: {data, loading, error}, checkCardBalance };
};

export default GetGiftCardBalance;
