import { ClientProps } from 'src';

import { useState, useEffect } from 'react';
import { getCustomerCartAddressesForAddressBookParser } from './getCustomerCartAddressesForAddressBookParser';

interface GetCustomerCartAddressesForAddressBookProps {
    isSignedIn: boolean,
    cartId: string
}

const GetCustomerCartAddressesForAddressBook = (clientProps: ClientProps) => (resolverProps: GetCustomerCartAddressesForAddressBookProps) => {
    const { restClient } = clientProps;
    const { cartId } = resolverProps;
    const { isSignedIn } = resolverProps;
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    console.log("Entrando en getCustomerCartAddresses")
    console.log(isSignedIn)
    console.log(cartId)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (isSignedIn && cartId) {
                const {data: rawData} = await restClient(
                    `/api/v3/checkouts/${cartId}`,
                    {
                        method: 'GET',
                        headers: {
                            backendTechnology: 'bigcommerce'
                        }
                    }
                );

                setData(getCustomerCartAddressesForAddressBookParser(rawData));
            };
            setLoading(false);
        };
        fetchData();
    }, [])

    console.log(data)
    return { data, loading };
};

export default GetCustomerCartAddressesForAddressBook;
