import React, {useEffect} from 'react';
import {withFirebase} from "../Firebase/context"

const AuthUserContext = React.createContext(null);

export const withAuthentication = Component => {
    return withFirebase((props) => {
        const [authUser, setAuthUser] = React.useState(null);
        useEffect(() => {
            props.firebase.auth.onAuthStateChanged(authUser => {
                console.log("Login changed");
                authUser ? setAuthUser({authUser}) : setAuthUser(null)
            });
        }, [])

        return (
            <AuthUserContext.Provider value={authUser}>
                <Component {...props} />
            </AuthUserContext.Provider>
        )
    });
};
export default AuthUserContext;
