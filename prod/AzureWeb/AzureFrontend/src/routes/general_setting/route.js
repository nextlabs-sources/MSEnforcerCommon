import React, { Component } from 'react'
import propTypes from 'prop-types'
import config from '../../config'
import { Button, Checkbox, } from '../../components'
import defaultOptions from '../../defaultOption'

class GeneralSetting extends Component {

    constructor(props) {
        super(props)

        this.props.init && this.props.init()
        this.state = {
            isTesting: false,
            testSuccess: false,
            testResult: '',
        }
        this.textChangeHandler = this.textChangeHandler.bind(this)
        this.checkHandler = this.checkHandler.bind(this)
        this.testConnHandler = this.testConnHandler.bind(this)
    }

    textChangeHandler(e) {
        const { onValueChange } = this.props
        onValueChange && onValueChange(e.target.id, e.target.value)
    }

    checkHandler(checked) {
        const { onValueChange } = this.props
        onValueChange && onValueChange('jpcHttps', checked)
    }

    testConnHandler(e) {
        this.setState({
            isTesting: true,
        })
        const { uid } = this.props
        const url = `/api/general_settings/connection/${uid}`

        fetch(url, {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify(this.props.config),
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        isTesting: false,
                        testSuccess: true,
                        testResult: config.Toast.testConnection.succeed,
                    })
                } else {
                    this.setState({
                        isTesting: false,
                        testSuccess: false,
                        testResult: config.Toast.testConnection.fail,
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isTesting: false,
                    testSuccess: false,
                    testResult: config.Toast.testConnection.fail,
                })
            })
    }

    render() {
        const sectionStyle = {
            margin: '20px 40px 20px',
        }
        const textbox = {
            width: '100%',
            height: '40px',
        }
        const group = {
            margin: '30px 0',
        }
        const groupTitle = {
            margin: '1.3em 0 .5em',
        }
        const { type } = this.props
        const { jpcHttps, jpcHost, jpcPort, ccHost, ccPort, clientId, clientKey, policyDecision, exceptionMsg, defaultMsg, fileInfoServer, fileInfoPort, } = this.props.config

        return (
            <div style={{ fontSize: '14px', color: '#333' }}>
                <div style={sectionStyle}>
                    <div>
                        <h2 style={{ margin: '1.5em 0 .5em' }}>Nextlabs Platform Configuration</h2>
                        <p style={{ fontSize: '11px', color: '#999' }}>Configure the host and port for the CloudAz or Control Center Policy Controller REST API</p>
                    </div>
                    <div>
                        <div style={group}>
                            <h4 style={groupTitle}>Policy Controller (PDP) Host</h4>
                            <div>
                                <input id='jpcHost' type='text' style={textbox} placeholder='Example: nxldemo-jpc.cloudaz.com' value={jpcHost} onChange={this.textChangeHandler} />
                                <Checkbox id='jpcHttps' checked={jpcHttps} style={{ width: '24px', height: '24px', verticalAlign: 'middle', margin: '0 8px' }} handler={this.checkHandler} />
                                <label style={{ fontWeight: '700', }}>Https</label>
                            </div>
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Policy Controller (PDP) Port</h4>
                            <input id='jpcPort' type='text' style={textbox} placeholder='Example: 58080' value={jpcPort} onChange={this.textChangeHandler} />
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Control Center Server Host</h4>
                            <input id='ccHost' type='text' style={textbox} placeholder='Example: nxldemo-cc.cloudaz.com' value={ccHost} onChange={this.textChangeHandler} />
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Control Center Server Port</h4>
                            <input id='ccPort' type='text' style={textbox} placeholder='Example: 443' value={ccPort} onChange={this.textChangeHandler} />
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Client ID</h4>
                            <input id='clientId' type='text' style={textbox} placeholder='Example: apiclient' value={clientId} onChange={this.textChangeHandler} />
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Client Key</h4>
                            <input id='clientKey' type='password' style={textbox} placeholder='Example: 123dynamics!;' value={clientKey} onChange={this.textChangeHandler} />
                        </div>
                        <div style={group}>
                            <Button className='btn-primary btn-md' onClick={this.testConnHandler} loading={this.state.isTesting}>Test Connection</Button>
                            <span style={{ display: this.state.testSuccess ? 'inline' : 'none', color: '#096', margin: '0 16px' }}>{this.state.testResult}</span>
                            <span style={{ display: !this.state.testSuccess ? 'inline' : 'none', color: '#c33', margin: '0 16px' }}>{this.state.testResult}</span>
                        </div>
                    </div>
                </div>
                <div style={{ ...sectionStyle, overflow: 'hidden', display: 'none' }}>
                    <div>
                        <h2 style={{ margin: '1.5em 0 .5em' }}>Default Policy Enforcement Settings</h2>
                        <p style={{ fontSize: '11px', color: '#999' }}>Default behavior in case of system or configuration issues</p>
                    </div>
                    <div>
                        <div style={group}>
                            <h4 style={groupTitle}>Policy Decision</h4>
                            <select id='policyDecision' className='btn-md' value={policyDecision} onChange={this.textChangeHandler}>
                                <option value='Allow'>Allow</option>
                                <option value='Deny'>Deny</option>
                            </select>
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Exception Message</h4>
                            <input id='exceptionMsg' type='text' style={textbox} placeholder='Access denied due to system error. Try again and contact the system administrator if the problem persists.' onChange={this.textChangeHandler} value={exceptionMsg} />
                        </div>
                        <div style={group}>
                            <h4 style={groupTitle}>Default Message</h4>
                            <input id='defaultMsg' type='text' style={textbox} placeholder='Access denied, you are not authorized to perform this operation.' onChange={this.textChangeHandler} value={defaultMsg} />
                        </div>
                    </div>
                </div>
                {
                    type !== 'azure_file' ? null : (
                        <div style={{ ...sectionStyle, overflow: 'hidden' }}>
                            <div>
                                <h2 style={{ margin: '1.5em 0 .5em' }}>File Info Server Configuration</h2>
                                <p style={{ fontSize: '11px', color: '#999' }}>Configure the server and port for the File Info Server</p>
                            </div>
                            <div>
                                <div style={group}>
                                    <h4 style={groupTitle}>File Info Server</h4>
                                    <input id='fileInfoServer' type='text' style={textbox} placeholder='Example: nxldemo-cc.cloudaz.com' onChange={this.textChangeHandler} value={fileInfoServer} />
                                </div>
                                <div style={group}>
                                    <h4 style={groupTitle}>File Info Port</h4>
                                    <input id='fileInfoPort' type='text' style={textbox} placeholder='Example: 445' onChange={this.textChangeHandler} value={fileInfoPort} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default GeneralSetting

GeneralSetting.propType = {
    uid: propTypes.func.isRequired,
}
