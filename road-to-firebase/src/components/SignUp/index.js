import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../Firebase';
import {compose} from 'recompose';


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const SignUpFormBase = (props) => {
    const [formState, setFormState] = React.useState(INITIAL_STATE);

    const isInvalid = formState.passwordOne !== formState.passwordTwo ||
        formState.passwordOne === '' ||
        formState.email === '' ||
        formState.username === '';
    const onSubmit = event => {
        event.preventDefault();
        const {email, passwordOne} = formState;
        props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                setFormState(INITIAL_STATE);
                props.history.push(ROUTES.HOME);
            })
            .catch(error => setFormState({error}));
    };
    const onChange = event => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };
    return (<form onSubmit={onSubmit}>
        <input name="username" value={formState.username || ''} onChange={onChange} type="text" placeholder="Name"/>
        <input name="email" value={formState.email || ''} onChange={onChange} type="text" placeholder="Email"/>
        <input name="passwordOne" value={formState.passwordOne || ''} onChange={onChange} type="password"
               placeholder="Password"/>
        <input name="passwordTwo" value={formState.passwordTwo || ''} onChange={onChange} type="password"
               placeholder="Confirm Password"/>
        <button type="submit" disabled={isInvalid}>Sign Up</button>
        {formState.error && <p>{formState.error.message}</p>}
    </form>);
};

const SignUpLink = () => (
    <p>
        Don't have an account?
        <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase);

const SignUpPage = () => (
    <div>
        <h1>SignUpPage</h1>
        <SignUpForm />
    </div>
);

export default SignUpPage;
export {SignUpForm, SignUpLink};
