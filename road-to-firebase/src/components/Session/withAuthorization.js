import React, {useEffect} from 'react';
import FirebaseContext, {withFirebase} from "../Firebase/context"
import {compose} from 'recompose';
import * as ROUTES from '../../constants/routes';
import {withRouter} from 'react-router-dom';

const withAuthorization = (condition) => {
    const AuthComponent = (Component) => {
        const InternalComponent = (props) => {
            useEffect(() => {
                props.firebase.auth.onAuthStateChanged(authUser => {
                    console.log("Login changed from withAuthorization");
                    if (!condition(authUser)) {
                        props.history.push(ROUTES.SIGN_IN);
                    }
                })
            }, []);
            return (<Component {...props} />);
        };
        return InternalComponent;
    }
    return compose(
        withRouter,
        withFirebase
    )(AuthComponent);
}

export default withAuthorization;
