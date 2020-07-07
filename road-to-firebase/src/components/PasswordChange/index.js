import React from 'react';
import {withFirebase} from "../Firebase"

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const PasswordChangeForm = (props) => {
    const [formState, setFormState] = React.useState(INITIAL_STATE);
    const onSubmit = (event) => {
        event.preventDefault();
        const {passwordOne} = formState;
        props.firebase.doPasswordUpdate(passwordOne)
            .then(() => {
                setFormState(INITIAL_STATE);
            })
            .catch(error => {
                setFormState({...formState, error});
            })
    }

    const onChange = event => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        })
    }

    const isInvalid = formState.passwordOne === '' || formState.passwordOne !== formState.passwordTwo;
    return (
        <form onSubmit={onSubmit}>
            <input name="passwordOne" value={formState.passwordOne} onChange={onChange} type="password" placeholder="Password" />
            <input name="passwordTwo" value={formState.passwordTwo} onChange={onChange} type="password" placeholder="Confirm Password" />
            <button disabled={isInvalid} type="submit">Change password</button>
            {formState.error && <p>{formState.error.message}</p>}
        </form>
    )
}

export default withFirebase(PasswordChangeForm);
