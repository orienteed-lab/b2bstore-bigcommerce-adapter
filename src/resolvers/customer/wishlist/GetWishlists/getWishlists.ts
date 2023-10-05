import { ClientProps } from 'src';

import { getWishlistsParser } from './getWishlistsParser';
import DEFAULT_OPERATIONS from './getWishlists.gql';

interface GetWishlistsProps {
    isSignedIn?: boolean;
    hasIsSignedIn: boolean;
    performQuery: boolean;
}

const GetWishlists =
    (clientProps: ClientProps) =>
    (resolverProps: GetWishlistsProps = { hasIsSignedIn: false, performQuery: true, isSignedIn: true }) => {
        const { mergeOperations, useQuery } = clientProps;
        const { isSignedIn, performQuery } = resolverProps;

        const operations = mergeOperations(DEFAULT_OPERATIONS);
        const { getWishlistsQuery } = operations;

        if (isSignedIn) {
            const { data, error, loading } = useQuery(getWishlistsQuery, {
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
        }

        if (!performQuery) {
            return { getWishlistsQuery };
        }

        return { data: null }; // Only gets to this return if there is a isSignedIn value and it's false
    };

export default GetWishlists;
