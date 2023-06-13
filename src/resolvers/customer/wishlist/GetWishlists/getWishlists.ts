import { ClientProps } from 'src';

import { getWishlistsParser } from './getWishlistsParser';
import DEFAULT_OPERATIONS from './getWishlists.gql';

const GetWishlists = (clientProps: ClientProps) => () => {
    const { mergeOperations, useQuery } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getWishlistsQuery } = operations;

    const { data, error, loading } = useQuery(getWishlistsQuery, {
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
        parsedData = getWishlistsParser(data);
    }

    return { data: parsedData, loading, error };

};

export default GetWishlists;
