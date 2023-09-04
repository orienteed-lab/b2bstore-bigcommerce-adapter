import { ClientProps } from 'src';
import { GetItemsInCartQueryVariables } from '@schema';

import { useEffect, useState } from 'react';
import { getItemsInCartParser } from './getItemsInCartParser';


const GetItemsInCart = (clientProps: ClientProps) => (resolverProps: GetItemsInCartQueryVariables) => {
    const { restClient } = clientProps;
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(null);
    const [categories, setCategories]=useState<any>(null);

    
    const fetchItemsInCart = async ({variables}) => {
        setLoading(true);
        try {
            const rawData = await restClient(
                `/api/v3/carts/${variables.cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
                {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                }
            );

            const categoryData = await Promise.all(
                [
                    ...rawData.data.line_items.physical_items,
                    ...rawData.data.line_items.digital_items,
                    ...rawData.data.line_items.custom_items,
                ].map(async (item) => {
                    const categoryResponse = await restClient(`/api/v3/catalog/products/${item.product_id}`, {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    });
    
                    const categoryNames = await Promise.all(
                        categoryResponse.data.categories.map(async (categoryId) => {
                            const categoryInfo = await restClient(`/api/v3/catalog/categories/${categoryId}`, {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            });
                            return categoryInfo.data.name;
                        })
                    );
    
                    return {
                        ...item,
                        categories: categoryNames,
                    };
                })
            );
    
    
            const updatedPhysicalItems = rawData.data.line_items.physical_items.map((item) => ({
                ...item,
                categories: categoryData.find((categoryItem) => categoryItem.product_id === item.product_id)?.categories || [],
            }));
    
            const combinedData = {
                ...rawData.data,
                line_items: {
                    ...rawData.data.line_items,
                    physical_items: updatedPhysicalItems,
                },
            };
    
            setData(combinedData);

        } catch (err: any) {
            setError(err);
        }
        
        setLoading(false);

    }
    
        let parsedData = undefined;
        if (data) {
            parsedData = getItemsInCartParser(data);
        }
        
        return { data: parsedData, loading, error, fetchItemsInCart };
    
};

export default GetItemsInCart;
