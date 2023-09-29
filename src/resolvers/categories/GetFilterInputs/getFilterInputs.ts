import { ClientProps } from 'src';
import { getFilterInputsParser } from './getFilterInputsParser';
import DEFAULT_OPERATIONS from './getFilterInputs.gql';
import { useEffect, useState } from 'react';


const GetFilterInputs = (clientProps: ClientProps) => () => {
    const { useAwaitQuery, mergeOperations } = clientProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [called, setCalled] = useState(false);


    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getFilterInputsQuery } = operations;
    const getFilters = useAwaitQuery(getFilterInputsQuery);

    useEffect(() => {
        const fetchQuery = async () => {
            setLoading(true);
            setCalled(true);
            try {
                const {data: filterData} = await getFilters({
                    context: {
                        headers: {
                            backendTechnology: ['bigcommerce']
                        }
                    }
                });

                setData(getFilterInputsParser(filterData))
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };
        fetchQuery();
    }, []);

    return { data, loading, error, called };
};

export default GetFilterInputs;
