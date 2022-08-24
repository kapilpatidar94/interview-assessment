import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ?(localStorage.getItem('role') ? <Redirect to='/audit'/>
            :<Component {...props} />)
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)