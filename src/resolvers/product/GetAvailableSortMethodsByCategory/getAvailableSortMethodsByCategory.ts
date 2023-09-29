import { ClientProps } from 'src';
import { GetAvailableSortMethodsByCategoryQueryVariables } from '@schema';

import { getAvailableSortMethodsByCategoryParser } from './getAvailableSortMethodsByCategoryParser';
import { useCallback, useState } from 'react';

const GetAvailableSortMethodsByCategory =
    (clientProps: ClientProps) => (resolverProps: GetAvailableSortMethodsByCategoryQueryVariables) => {
        const { restClient } = clientProps;
        const [data, setData] = useState<any>(undefined);

        const getSortMethods = useCallback(async ({variables}) => {
            const rawData = await restClient(`/api/v3/catalog/categories/${variables.categoryIdFilter.in}/products/sort-order`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerce'
                }
            });

            setData(getAvailableSortMethodsByCategoryParser(rawData));
        }, []);

        return { data, getSortMethods };
    };

export default GetAvailableSortMethodsByCategory;
