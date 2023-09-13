import { ClientProps } from 'src';
import { getMegaMenuParser } from './getMegaMenuParser';
import DEFAULT_OPERATIONS from './getMegaMenu.gql';
import { useEffect, useState } from 'react';

const GetMegaMenu = (clientProps: ClientProps) => () => {
    const { useAwaitQuery, mergeOperations } = clientProps;
    const [data, setData] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getMegaMenuQuery } = operations;

    const getMegaMenu = useAwaitQuery(getMegaMenuQuery);

    const refetch = async () => {
        const { data: categoryData } = await getMegaMenu({
            context: {
                headers: {
                    backendTechnology: ['bigcommerce']
                }
            }
        });

        setData(getMegaMenuParser(categoryData));
        console.log(data);
    };

    useEffect(() => {
        refetch();
        console.log('HOLI');
    }, []);

    return { data, refetch };
};

export default GetMegaMenu;
