import { ClientProps } from 'src';
import { GetProductDetailForProductPageByUrlKeyQueryVariables } from '@schema';

interface GetProductDetailForProductPageByUrlKeyProps extends GetProductDetailForProductPageByUrlKeyQueryVariables { // Use this interface to get the store config data from the call
    storeConfigData: any;
}

const GetProductDetailForProductPageByUrlKey =
    (clientProps: ClientProps) => (resolverProps: GetProductDetailForProductPageByUrlKeyProps) => {
        // Look docs for more info about how to fill this function

        return { data: {}, loading: false, error: undefined };
    };

export default GetProductDetailForProductPageByUrlKey;
