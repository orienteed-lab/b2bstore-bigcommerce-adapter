import { ClientProps } from 'src';
import { SetOrderAttributesMutationVariables } from '@schema';

const SetOrderAttributes = (clientProps: ClientProps) => (resolverProps: SetOrderAttributesMutationVariables) => {
    const { restClient } = clientProps;

    const customAttributeQuoteSave = async ({ variables }) => {
        const { data: orderData } = await restClient(`/api/v2/orders?cart_id=${variables.masked_id}`, {
            method: 'GET',
            headers: {
                backendTechnology: 'bigcommerce'
            }
        });

        if (orderData) {
            await restClient(`/api/v2/orders/${orderData[0].id}`, {
                method: 'PUT',
                headers: {
                    backendTechnology: 'bigcommerce'
                },
                body: JSON.stringify({
                    customer_message: variables.comment,
                    external_order_id: variables.external_order_number
                })
            });
        }
    };

    return { customAttributeQuoteSave };
};

export default SetOrderAttributes;
