import { ClientProps } from 'src';
import { ApplyGiftCardToCartMutationVariables } from '@schema';
import DEFAULT_OPERATIONS from './applyGiftCardToCart.gql';

import { useState } from 'react';

const ApplyGiftCardToCart = (clientProps: ClientProps) => (resolverProps: ApplyGiftCardToCartMutationVariables) => {
    // Look docs for more info about how to fill this function
    const { restClient, mergeOperations, useAwaitQuery } = clientProps;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { applyGiftCardToCartMutation } = operations;
    const getStoreURI = useAwaitQuery(applyGiftCardToCartMutation);

    const applyGiftCardToCart = async ({ variables }) => {
        let parsedData = undefined;
        setLoading(true);
        try {
            const { data: storeData } = await getStoreURI({
                context: {
                    headers: {
                        backendTechnology: ['bigcommerce']
                    }
                }
            });
            const storeURI = storeData.site.settings.url.vanityUrl.split("//").pop();
            parsedData = JSON.stringify({giftCertificateCode: variables.giftCardCode});

            //TODO: POST method to other domain (storefront URI) fails
            //The preflight of the request (the preflight request is triggered by special cross-site request (POST)) gives an error of invalid or missing headers
            //Solution: set a proxy that capture traffic going to the storeURI and modify the following response headers:
            /*
            access-control-allow-origin: http://localhost:10000/
            access-control-allow-credentials: true
            access-control-allow-methods: POST
            access-control-allow-headers: api-authorization,authorization,backendtechnology,content-type
            access-control-max-age: 86400 (duration of 1 day)
            */
                //Problem: browser (chrome or brave) gives the following error, but 
                //initiator context (http://localhost:10000/) and 
                //Allowed Origin (from header) (http://localhost:10000/) are the same:
                /*
                A cross-origin resource sharing (CORS) request was blocked because the Access-Control-Allow-Origin
                response header of the request or the associated preflight request specified an origin 
                different from the origin of the context that initiated the request.
                */ 
            
            //Another solution is to bypass CORS restricction disabling it in the browser
            /*
            Brave: brave.exe --user-data-dir="C://Chrome dev session" --disable-web-security
            Chrome: chrome.exe --disable-web-security --disable-gpu --user-data-dir=%LOCALAPPDATA%\Google\chromeTemp
            */
                //Problem: b2bstore don't set the cookies to the client by the following warning
                /* 
                this Set-Cookie header didn't specify a "SameSite" attribute and was defaulted to "SameSite=Lax" 
                and was blocked because it came from a cross-site response which was not the response 
                to a top-level naviation. The Set-Cookie had to have been set with "SameSite=None" 
                to enable cross-site usage
                */  
            //Posible solution: edit cookies on DevTools and set them to SameSite=None and enable the Security field 

            const data = await restClient(`https://${storeURI}/api/storefront/checkouts/${variables.cartId}/gift-certificates`, {
                //?include=line_items.physical_items.options,line_items.digital_items.options
                method: 'POST',
                headers: {
                    backendTechnology: 'bigcommerce',
                },
                body: parsedData
            });
            console.log("GIFT RESPONSE");
            console.log(data);
        } catch (err) {
            console.log("GIFT ERROR");
            console.log(err)
            setError(err);
        };
        setLoading(false);
    };
    //We return the entire function because only is triggered when clicked the APPLY button of the gift certificates view.
    return { applyGiftCardToCart, loading, error };
};

export default ApplyGiftCardToCart;
