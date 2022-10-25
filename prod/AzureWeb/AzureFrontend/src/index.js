import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { ConnectedRouter, routerMiddleware, } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import * as routes from './routes'
import {
    NavBar,
    ErrorPopups,
    AuthRoute,
} from './containers'
import middlewares from './middlewares'
import Config from './config'
import cache from './cache'
import './reset.css'
import './module.css'
import config from './config';

window.errorId = 1
let prevState

try {
    prevState = JSON.parse(cache.getCache(Config.App.localStorageKey))
    if (!prevState) {
        prevState = {}
    } else {
        if(window.location.pathname.indexOf(config.Routes.azure_oauth) < 0) {
            const urlSegs = window.location.pathname.split('/')
            const newUid = urlSegs[2]
            const oldUid = prevState.app.uid
    
            if(oldUid !== newUid) {
                prevState = {}
            }
        }
    }
} catch (err) {
    prevState = {}
}

const history = createHistory()
const middlewareRoute = routerMiddleware(history)
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, prevState, composeEnhancer(applyMiddleware(thunk, middlewares.ErrorQueue, middlewares.Persistor, middlewareRoute)))

window.onbeforeunload = e => {
    if(store.getState().auth.isLoggedIn) {
        const promptMsg = 'Are you sure you want to leave without logging out?'
        e.returnValue = promptMsg
        return promptMsg
    }
}

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <React.Fragment>
                <NavBar />
                <div style={{ boxSizing: 'border-box', height: '100vh', paddingTop: '30px', overflow: 'auto', }}>
                    <Switch>
                        <Route path={Config.Routes.login} component={routes.Login} />
                        <AuthRoute path={Config.Routes.dashboard} component={routes.Dashboard} />
                        <Route path={Config.Routes.azure_oauth} component={routes.AzureOAuth} />
                        <Route path={Config.Routes.signup} component={routes.Signup} />
                        <Route component={routes.NotFound} />
                    </Switch>
                </div>
                <ErrorPopups />
            </React.Fragment>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
)
