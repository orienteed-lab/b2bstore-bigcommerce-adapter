import { ClientProps } from 'src';
import { GetQuoteListQueryVariables } from '@schema';

import { getQuoteListParser } from './getQuoteListParser';
import { useEffect, useState } from 'react';

const GetQuoteList = (clientProps: ClientProps) => (resolverProps: GetQuoteListQueryVariables) => {
    const { restClient } = clientProps;
    const { pageSize: pageSizeProp, currentPage: currentPageProp } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const refetch = async ({pageSize, currentPage}) => {
        setLoading(true);
        try {
        const { data: quoteList, meta } = await restClient(`/api/v3/io/rfq?limit=${pageSize*currentPage}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerceb2b',
                accept: 'application/json'
            }
        });

        const quoteListData = quoteList.slice(pageSize*(currentPage-1), pageSize*currentPage);

        const quotesData = await Promise.all(quoteListData.map(async (quote) => {
            const { data: quoteData } = await restClient(`/api/v3/io/rfq/${quote.quoteId}?date=${quote.createdAt}`, {
                method: 'GET',
                headers: {
                    backendTechnology: 'bigcommerceb2b'
                }
            });

            return quoteData;
        }))

        setData(getQuoteListParser(quoteListData, meta, quotesData, pageSize, currentPage));
    } catch (err) {
        console.log(err);
    }
        setLoading(false);
    }

    useEffect(() => {
        refetch({pageSize: pageSizeProp, currentPage: currentPageProp})
    }, [])

    return { data, loading, refetch };
};

export default GetQuoteList;
