import { ClientProps } from 'src';
import { SignInMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './signIn.gql';

const SignIn = (clientProps: ClientProps) => (resolverProps: SignInMutationVariables) => {
    const { mergeOperations, useMutation } = clientProps;

    const { signInMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const [performMutation, { error }] = useMutation(signInMutation);

    const signIn = async (email, password, auth) => {
        let token = '';
        console.log(auth);
        console.log(email);
        console.log(password);
        const data = await performMutation({
            variables: {
                email,
                password
            },
            context: {
                headers: {
                    backendTechnology: ['bigcommerce'],
                    authorization: `Bearer ${auth}`
                }
            }
        });

        if (data) {
            token = auth;
        }
        return { data: { generateCustomerToken: { token: token } } };
    };

    return { signIn, error };
};

export default SignIn;
