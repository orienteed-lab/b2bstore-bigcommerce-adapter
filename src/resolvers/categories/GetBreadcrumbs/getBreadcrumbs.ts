import { ClientProps } from 'src';
import { GetBreadcrumbsQueryVariables } from '@schema';
import { getBreadcrumbsParser } from './getBreadcrumbsParser';
import DEFAULT_OPERATIONS from './getBreadcrumbs.gql';

const GetBreadcrumbs = (clientProps: ClientProps) => (resolverProps: GetBreadcrumbsQueryVariables) => {
    const { useQuery, mergeOperations } = clientProps;
    const { category_id } = resolverProps;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getBreadcrumbsQuery } = operations;


    const { data, loading, error } = useQuery(getBreadcrumbsQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
        variables: {
            id: parseInt(category_id)
        }
    });

    let parsedData = undefined;


    if (data) {
        parsedData = getBreadcrumbsParser(data);
    }

    return { data: parsedData, loading, error };
};

export default GetBreadcrumbs;
