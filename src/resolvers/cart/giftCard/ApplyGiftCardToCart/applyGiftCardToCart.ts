import { ClientProps } from 'src';
import { ApplyGiftCardToCartMutationVariables } from '@schema';

import { useState } from 'react';

const ApplyGiftCardToCart = (clientProps: ClientProps) => (resolverProps: ApplyGiftCardToCartMutationVariables) => {
    const { restClient } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const applyGiftCardToCart = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        try {

            const body = {giftCertificateCode: variables.giftCode}

            const {data: giftCertificateData} = await restClient(`/rest/api/storefront/checkouts/${variables.cartId}/gift-certificates`, {
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce',
                },
                body: JSON.stringify(body)
                
            });
        } catch (err) {
            console.log(err)
            setError(err);
        };

        //Only parser left. We need to obtain the response to parse the data
        setLoading(false);
    };
    return { applyGiftCardToCart, loading, error };
};

export default ApplyGiftCardToCart;
