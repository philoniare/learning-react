import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const SignUpForm = () => {
    const [formState, setFormState] = React.useState({
        username: '',
        email: '',
        passwordOne: '',
        passwordTwo: '',
        error: null,
    });
    const onSubmit = event => {

        event.preventDefault();
    };
    const onChange = event => {
        setFormState({
            [event.target.name]: event.target.value
        });
    };
    return (<form onSubmit={onSubmit}>
        <input name="username" value={formState.username} onChange={onChange} type="text" placeholder="Name"/>
        <input name="email" value={formState.email} onChange={onChange} type="text" placeholder="Email"/>
        <input name="passwordOne" value={formState.passwordOne} onChange={onChange} type="password"
               placeholder="Password"/>
        <input name="passwordTwo" value={formState.passwordTwo} onChange={onChange} type="password"
               placeholder="Confirm Password"/>
        <button type="submit">Sign Up</button>
        {formState.error && <p>{formState.error.message}</p>}
    </form>);
};

const SignUpLink = () => (
    <p>
        Don't have an account?
        <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpPage = () => (
    <div>
        <h1>SignUpPage</h1>
        <SignUpForm/>
    </div>
);

export default SignUpPage;
export {SignUpForm, SignUpLink};
