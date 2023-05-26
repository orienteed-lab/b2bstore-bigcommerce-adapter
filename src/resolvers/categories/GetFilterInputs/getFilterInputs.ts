import { ClientProps } from 'src';
import { getFilterInputsParser } from './getFilterInputsParser';
import DEFAULT_OPERATIONS from './getFilterInputs.gql';


const GetFilterInputs = (clientProps: ClientProps) => () => {
    const { useQuery, mergeOperations } = clientProps;


    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getFilterInputsQuery } = operations;


    const { data, loading, error } = useQuery(getFilterInputsQuery, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        }
    });

    let parsedData = undefined;


    if (data) {
        parsedData = getFilterInputsParser(data);
    }

    return { data: parsedData, loading, error };
};

export default GetFilterInputs;
