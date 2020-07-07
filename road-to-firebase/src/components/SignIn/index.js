import React from 'react';
import * as ROUTES from '../../constants/routes';
import {withRouter} from 'react-router-dom';
import {withFirebase} from "../Firebase"
import {SignUpLink} from "../SignUp";
import {compose} from 'recompose';
import {PasswordForgetLink} from "../PasswordForget";

const SignInPage = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <PasswordForgetLink/>
        <SignUpLink/>
    </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const SignInFormBase = (props) => {
    const [formState, setFormState] = React.useState(INITIAL_STATE);
    const onSubmit = (event) => {
        const {email, password} = formState;
        props.firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                setFormState(INITIAL_STATE);
                props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                setFormState({...formState, error});
            })
        event.preventDefault();
    }

    const onChange = event => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        })
    }

    const isInvalid = formState.password === '' || formState.email === '';
    return (
        <form onSubmit={onSubmit}>
            <input name="email" value={formState.email} onChange={onChange} type="text" placeholder="Email" />
            <input name="password" value={formState.password} onChange={onChange} type="password" placeholder="Password" />
            <button disabled={isInvalid} type="submit">Sign In</button>
            {formState.error && <p>{formState.error.message}</p>}
        </form>
    )
}

const SignInForm = compose(
    withRouter,
    withFirebase,
) (SignInFormBase);

export default SignInPage;
