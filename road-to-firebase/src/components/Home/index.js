import React from 'react';
import {withAuthorization} from '../Session';

const HomePage = () => (
    <div>
        <h1>HomePage</h1>
        <p>Only accessible to logged in users</p>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
