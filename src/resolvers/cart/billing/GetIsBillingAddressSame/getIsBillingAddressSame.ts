import { ClientProps } from 'src';
import { GetIsBillingAddressSameQueryVariables } from '@schema';

import { getIsBillingAddressSameParser } from './getIsBillingAddressSameParser';
import { useEffect, useState } from 'react';

const GetIsBillingAddressSame = (clientProps: ClientProps) => (resolverProps: GetIsBillingAddressSameQueryVariables) => {
    const { restClient } = clientProps;
    const [data, setData] = useState<any>(null);
    const {cartId}= resolverProps
    
    useEffect(() => {
        const fetchIsBillingAddressSame = async () => {
        
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
                setData(getIsBillingAddressSameParser(checkoutData.data)) 
            }
    
        }
        
        fetchIsBillingAddressSame();
        
    },[])
    
    console.log("Data: ", data)
    return { data: data };

};

export default GetIsBillingAddressSame;
