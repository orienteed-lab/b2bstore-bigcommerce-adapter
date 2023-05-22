import { ClientProps } from 'src';
import { getMegaMenuParser } from './getMegaMenuParser';
import DEFAULT_OPERATIONS from './getMegaMenu.gql';

const GetMegaMenu = (clientProps: ClientProps) => () => {
    const { useQuery, mergeOperations } = clientProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getMegaMenuQuery } = operations;

    const { data, refetch } = useQuery(getMegaMenuQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    let parsedData = undefined;

    if (data) {
        parsedData = getMegaMenuParser(data);
    }

    return { data: parsedData, refetch };
};

export default GetMegaMenu;
