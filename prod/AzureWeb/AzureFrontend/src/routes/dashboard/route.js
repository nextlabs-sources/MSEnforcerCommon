import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import propTypes from 'prop-types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import config from '../../config'
import SecureEntity from '../secure_entity'
import UserAttributes from '../user_attributes'
import GeneralSettings from '../general_setting'
import './index.css'
import {
    PanelLeft,
    SQLDeployModal,
    SQLLoginModal,
    FileLoginModal,
    SQLProxyModal,
    FileProxyModal,
    UserLoadModal,
    UserImportModal,
    LoginHelpSidebar,
} from '../../containers'
import {
    SEToolbar,
    UAToolbar,
    GeneralSettingToolbar,
} from '../../containers'
import SQLProxy from '../sql_proxy'
import FileProxy from '../file_proxy'

class Dashboard extends Component {
    constructor() {
        super()
        this.state = {
            scrolled: false
        }
    }

    render() {
        const { type, location, addSQLConnHandler, addFileConnHandler } = this.props

        return (
            <div style={{ minWidth: '1280px', minHeight: '720px', height: '100%', overflow: 'auto', }}>
                <div className='dashColLeft'>
                    <PanelLeft />
                </div>
                <div className='dashColRight' ref={el => {
                    if (el) {
                        this.el = el
                    }
                }} onScroll={e => {
                    if (!this.state.scrolled && e.currentTarget.scrollTop >= 100) {
                        this.setState({
                            scrolled: true
                        })
                    } else if (this.state.scrolled && e.currentTarget.scrollTop === 0) {
                        this.setState({
                            scrolled: false
                        })
                    }
                }}>
                    <div style={{ height: '60px', overflow: 'hidden', textAlign: 'right' }}>
                        <Route exact path={config.Routes.tables} render={() => (type === 'azure_sql' ? <SEToolbar /> : null)} />
                        <Route exact path={config.Routes.user_attributes} render={() => (type === 'azure_sql' ? <UAToolbar /> : null)} />
                        <Route exact path={config.Routes.general_settings} component={GeneralSettingToolbar} />
                        <Route path={config.Routes.dashboard} render={() => (type === 'azure_sql' ? <button className='btn-primary btn-md' style={{ margin: '12px' }} onClick={addSQLConnHandler}>Configure Proxy</button> : null)} />
                        <Route path={config.Routes.dashboard} render={() => (type === 'azure_file' ? <button className='btn-primary btn-md' style={{ margin: '12px' }} onClick={addFileConnHandler}>Configure Proxy</button> : null)} />
                    </div>
                    <hr />
                    <TransitionGroup>
                        <CSSTransition key={location.key} classNames='fade' timeout={300}>
                            <Switch>
                                <Route exact path={config.Routes.tables} component={SecureEntity} />
                                <Route exact path={config.Routes.user_attributes} component={UserAttributes} />
                                <Route exact path={config.Routes.general_settings} component={GeneralSettings} />
                                <Route exact path={config.Routes.servers} render={({ match }) => {
                                    return type === 'azure_sql' ? <SQLProxy match={match} /> : <FileProxy match={match} />
                                }} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                    <label style={{ position: 'fixed', visibility: this.state.scrolled ? 'visible' : 'collapse', right: '60px', bottom: '30px', boxShadow: '0 0 4px 1px #ccc', cursor: 'pointer', }} onClick={e => this.el && (this.el.scrollTop = 0)}>
                        <svg width="36" height="36" viewBox="0 0 24 24" style={{ verticalAlign: 'top' }}>
                            <path fill="none" d="M0 0h24v24H0V0z" />
                            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                        </svg>
                        {
                            //the span element below is used to be compatiable with IE & Edge, 
                            //because in react restoreSelection, it uses document.activeElement to get the focused element and restore the focus, 
                            //for chrome & firefox, if no text is selected, the activeElement should return body element
                            //but in IE/Edge, the activeElement always return the one clicked, that is, the svg element above,
                            //which always throws error in IE/Edge because svg element does not have a method focus
                            //by joe06102@gmail.com 2018/08/09
                        }
                        <span style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', backgroundColor: 'transparent', fontSize: '0' }}></span>
                    </label>
                    <SQLDeployModal />
                    <SQLLoginModal />
                    <FileLoginModal />
                    <SQLProxyModal />
                    <FileProxyModal />
                    <UserLoadModal />
                    <UserImportModal />
                    <LoginHelpSidebar />
                </div>
            </div>
        )
    }
}

export default Dashboard

Dashboard.propTypes = {
    type: propTypes.string.isRequired,
    location: propTypes.shape({
        key: propTypes.string.isRequired,
    }).isRequired,
    addSQLConnHandler: propTypes.func.isRequired,
    addFileConnHandler: propTypes.func.isRequired,
}
