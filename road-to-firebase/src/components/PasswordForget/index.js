import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../Firebase';


const INITIAL_STATE = {
    email: '',
    error: null,
};

const PasswordForgetBaseForm = (props) => {
    const [formState, setFormState] = React.useState(INITIAL_STATE);

    const isInvalid = formState.email === '';
    const onSubmit = event => {
        event.preventDefault();
        const {email} = formState;
        props.firebase.doPasswordReset(email)
            .then(() => {
                setFormState(INITIAL_STATE);
            })
            .catch(error => {
                setFormState({error})
            });
    };
    const onChange = event => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };
    return (<form onSubmit={onSubmit}>
        <input name="email" value={formState.email || ''} onChange={onChange} type="text" placeholder="Email"/>
        <button type="submit" disabled={isInvalid}>Reset password</button>
        {formState.error && <p>{formState.error.message}</p>}
    </form>);
};

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

const PasswordForgetForm = withFirebase(PasswordForgetBaseForm);

const PasswordForgetPage = () => (
    <div>
        <h1>Forgot Password</h1>
        <PasswordForgetForm />
    </div>
);

export default PasswordForgetPage;
export {PasswordForgetForm, PasswordForgetLink};
