import { ClientProps } from 'src';
import { CancelQuoteMutationVariables } from '@schema';

const CancelQuote = (clientProps: ClientProps) => (resolverProps: CancelQuoteMutationVariables) => {
    const { restClient } = clientProps;

    const cancelMpQuote = async ({ variables }) => {
        await restClient(`/api/v3/io/rfq/${variables.quoteId}`, {
            method: 'DELETE',
            headers: {
                backendTechnology: 'bigcommerceb2b'
            }
        });
    };

    return { cancelMpQuote };
};

export default CancelQuote;
