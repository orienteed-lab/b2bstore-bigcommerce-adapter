import { ClientProps } from 'src';
import { IsEmailAvailableQueryVariables } from '@schema';

import { isEmailAvailableParser } from './isEmailAvailableParser';
import { useState } from 'react';

const IsEmailAvailable = (clientProps: ClientProps) => (resolverProps: IsEmailAvailableQueryVariables) => {
    const { restClient } = clientProps;
    const [data, setData] = useState(undefined);

    const runQuery = async ({ variables }) => {
        const rawData = await restClient(`/api/v3/customers?email:in=${variables.email}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        setData(isEmailAvailableParser(rawData.data));
    };

    return { runQuery, data };
};

export default IsEmailAvailable;
