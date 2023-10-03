import { ClientProps } from 'src';

import DEFAULT_OPERATIONS from './signOut.gql';

const SignOut = (clientProps: ClientProps) => () => {
    const { mergeOperations, useMutation } = clientProps;

    const { signOutMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const [revokeToken] = useMutation(signOutMutation, {
        context: {
            headers: {
                backendTechnology: ['bigcommerce']
            }
        },
    });

    return { revokeToken };
};

export default SignOut;
