import React, { Component } from 'react'
import propTypes from 'prop-types'
import { compile } from 'path-to-regexp'
import SQLTab from '../SQLTab'
import FileTab from '../FileTab'
import Menu from '../Menu'
import './index.css'
import dashIcon from '../../statics/imgs/dashboard-icon.png'
import serverIcon from '../../statics/imgs/servers.png'
import entityIcon from '../../statics/imgs/entities.png'
import attrIcon from '../../statics/imgs/attributes.png'
import settingIcon from '../../statics/imgs/settings.png'
import config from '../../config'

class PanelLeft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: '',
        }

        this.menuHandler = this.menuHandler.bind(this)
    }

    menuHandler(tabName) {
        this.setState({
            currentTab: tabName,
        })
    }

    render() {
        const { currentTab } = this.state
        const { uid, type, servers, databases, serverTabHandler, dbTabHandler, fileServers, fileTabHandler } = this.props
        const serverTabs = Object.keys(servers).map(k => ({ ...servers[k], paddingLeft: '37px' }))
        const dbTabs = Object.keys(databases).map(k => ({ ...databases[k], paddingLeft: '37px' }))
        const fileTabs = Object.keys(fileServers).map(k => ({ ...fileServers[k], paddingLeft: '37px' }))
        const getGeneralSettingPath = compile(config.Routes.general_settings)
        const getUserAttributePath = compile(config.Routes.user_attributes)

        return (
            <div>
                <div className='panelHeader'>
                    <Menu name='Dashboard' icon={dashIcon} isActive={currentTab === 'Dashboard'} outterHandler={this.menuHandler} padding='14px 0' />
                </div>
                <hr />
                {
                    type === 'azure_sql' ? (
                        <div className='panelBody'>
                            <Menu icon={serverIcon} name='SQL Servers' isActive={currentTab === 'SQL Servers'} outterHandler={this.menuHandler}>
                                {
                                    serverTabs.map(ti => <FileTab key={ti.name} uid={uid} type={type} name={ti.name} handler={serverTabHandler} tip={ti.name} paddingLeft={ti.paddingLeft} />)
                                }
                            </Menu>                        
                            <Menu icon={entityIcon} name='Secure Tables' isActive={currentTab === 'Secure Tables'} outterHandler={this.menuHandler}>
                                {
                                    dbTabs.map(ti => <SQLTab key={`${ti.server}/${ti.name}`} uid={uid} type={type} name={ti.name} server={ti.server} handler={dbTabHandler} tip={`${ti.server}/${ti.name}`} paddingLeft={ti.paddingLeft} />)
                                }
                            </Menu>
                            <Menu icon={attrIcon} name='Secure Users' link={getUserAttributePath({ uid, type })} isActive={currentTab === 'Secure Users'} outterHandler={this.menuHandler} />
                            <Menu icon={settingIcon} name='General Settings' link={getGeneralSettingPath({ uid, type })} isActive={currentTab === 'General Settings'} outterHandler={this.menuHandler} />
                        </div>
                    ) : (
                        <div className='panelBody'>
                            <Menu icon={serverIcon} name='File Servers' isActive={currentTab === 'File Servers'} outterHandler={this.menuHandler}>
                                {
                                    fileTabs.map(ti => <FileTab key={ti.name} uid={uid} type={type} name={ti.name} handler={fileTabHandler} tip={ti.name} paddingLeft={ti.paddingLeft} />)
                                }
                            </Menu>                        
                            <Menu icon={settingIcon} name='General Settings' link={getGeneralSettingPath({ uid, type })} isActive={currentTab === 'General Settings'} outterHandler={this.menuHandler} />
                        </div>
                    )
                }
                <hr />
                <div className='panelFooter' />
            </div>
        )
    }
}

export default PanelLeft

PanelLeft.propTypes = {
    uid: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    servers: propTypes.object.isRequired,
    databases: propTypes.object.isRequired,
    fileServers: propTypes.object.isRequired,    
    serverTabHandler: propTypes.func.isRequired,
    dbTabHandler: propTypes.func.isRequired,
    fileTabHandler: propTypes.func.isRequired,
}
