import React from 'react'
import { Route, Redirect } from 'react-router'
import path2reg from 'path-to-regexp'
import propTypes from 'prop-types'
import config from '../../config'

const AuthRoute = ({ isAuthed, uid, type, component: Component, ...rest }) => {
    const getLoginPath = path2reg.compile(config.Routes.login)
    uid = uid || '06102'
    type = type || 'joe'
    
    return <Route {...rest} render={props => {
        return isAuthed ? <Component {...props} /> : <Redirect to={{
            pathname: getLoginPath({ uid, type }),
            state: props.location,
        }} />
    }} />    
}

AuthRoute.propTypes = {
    isAuthed: propTypes.bool.isRequired,
    uid: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    component: propTypes.func.isRequired,
    path: propTypes.string.isRequired,
    exact: propTypes.bool,
}

export default AuthRoute