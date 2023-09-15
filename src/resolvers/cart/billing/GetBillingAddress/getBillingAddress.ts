import { ClientProps } from 'src';
import { GetBillingAddressQueryVariables } from '@schema';

import { useState } from 'react';
import { getBillingAddressParser } from './getBillingAddressParser';

interface GetBillingAddressProps extends GetBillingAddressQueryVariables {
    type: 'request';
}

const GetBillingAddress = (clientProps: ClientProps) => (resolverProps: GetBillingAddressProps) => {
    const { restClient } = clientProps;
    const [data, setData] = useState<any>(null);
    const {cartId, type }= resolverProps

    const loadBillingAddressQuery = async () => {
        
        if(cartId){
            const checkoutData = await restClient(
                `/api/v3/checkouts/${cartId}`,
                {
                    method: 'GET',
                    headers: {
                        backendTechnology: 'bigcommerce'
                    }
                }
            );
            setData(getBillingAddressParser(checkoutData.data))    
        }
    } 

    if(type ==='request'){
        return { data: data, loadBillingAddressQuery };
    }else{
        loadBillingAddressQuery();
    }
    
    return { data: data, loadBillingAddressQuery };
};

export default GetBillingAddress;
