import { ClientProps } from 'src';
import { GetProductsInWishlistsQueryVariables } from '@schema';

import { getProductsInWishlistsParser } from './getProductsInWishlistsParser';
import DEFAULT_OPERATIONS from './getProductsInWishlists.gql';

const GetProductsInWishlists = (clientProps: ClientProps) => () => {
    const { mergeOperations, useQuery } = clientProps;
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getProductsInWishlistsQuery } = operations;

    const { client,  data  } = useQuery(getProductsInWishlistsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });
    
    

    let parsedData = undefined;

    if (data) {
         parsedData = getProductsInWishlistsParser(data);
     }
     return { data: parsedData, client};
};

export default GetProductsInWishlists;
