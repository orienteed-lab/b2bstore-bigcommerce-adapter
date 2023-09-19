import { ClientProps } from 'src';
import { SignInMutationVariables } from '@schema';

import DEFAULT_OPERATIONS from './signIn.gql';

const SignIn = (clientProps: ClientProps) => (resolverProps: SignInMutationVariables) => {
    const { mergeOperations, useMutation } = clientProps;

    const { signInMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const [performMutation, { error }] = useMutation(signInMutation);

    const signIn = async ({variables}) => {
        let token = '';
        console.log(variables.auth);
        console.log(variables.email);
        console.log(variables.password);
        const data = await performMutation({
            variables: {
                email: variables.email,
                password: variables.password
            },
            context: {
                headers: {
                    backendTechnology: ['bigcommerce'],
                    authorization: `Bearer ${variables.auth}`
                }
            }
        });

        if (data) {
            token = variables.auth;
        }
        return { data: { generateCustomerToken: { token: token } } };
    };

    return { signIn, error };
};

export default SignIn;
