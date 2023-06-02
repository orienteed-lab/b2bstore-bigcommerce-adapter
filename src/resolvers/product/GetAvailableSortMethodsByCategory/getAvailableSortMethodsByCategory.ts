import { ClientProps } from 'src';
import { GetAvailableSortMethodsByCategoryQueryVariables } from '@schema';

import { getAvailableSortMethodsByCategoryParser } from './getAvailableSortMethodsByCategoryParser';
import { useEffect, useState } from 'react';

const GetAvailableSortMethodsByCategory =
    (clientProps: ClientProps) => (resolverProps: GetAvailableSortMethodsByCategoryQueryVariables) => {
        const { restClient } = clientProps;
         //const { categoryIdFilter }  = resolverProps;

        const [loading, setLoading] = useState(true);
        const [data, setData] = useState<any>(null);
        const [error, setError] = useState(null);

        const getSortMethods = async (categoryIdFilter) => {
            setLoading(true);
            try {
                const rawData = await restClient(`/api/v3/catalog/categories/${categoryIdFilter}/products/sort-order`, {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                });

                setData(rawData);
            } catch (err: any) {
                setError(err);
            }
            setLoading(false);

        };



        let parsedData = undefined;
        if (data) {
            parsedData = getAvailableSortMethodsByCategoryParser(data);
        }
        return { data: parsedData, loading, error, getSortMethods };

    };

export default GetAvailableSortMethodsByCategory;
