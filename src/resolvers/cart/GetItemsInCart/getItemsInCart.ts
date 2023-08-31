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

            //console.log("RAW DATA:", rawData)
            
            // TODO_B2B: Check if this code is good
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
                    console.log("RESPONSE CATEGORY: ", categoryResponse);
    
                    // Obtener nombres de categorías a partir de las IDs de categoría
                    const categoryNames = await Promise.all(
                        categoryResponse.data.categories.map(async (categoryId) => {
                            const categoryInfo = await restClient(`/api/v3/catalog/categories/${categoryId}`, {
                                method: 'GET',
                                headers: {
                                    backendTechnology: 'bigcommerce'
                                }
                            });
                            return categoryInfo.data.name; // Supongamos que el nombre de la categoría se encuentra en "name"
                        })
                    );
    
                    return {
                        ...item,
                        categories: categoryNames, // Reemplazar las IDs de categoría con los nombres de categoría
                    };
                })
            );
    
            //console.log(categoryData);
    
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
    
            console.log("COMBINED DATA: ", combinedData);
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
