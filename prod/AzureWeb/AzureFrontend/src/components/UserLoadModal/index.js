import React, { Component } from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'

class UserLoadModal extends Component {

    static getDerivedStateFromProps(props, prevState) {
        const { tenantId, appClientId, appClientKey } = props

        if (
            tenantId !== prevState.tenantId ||
            appClientId !== prevState.appClientId ||
            appClientKey !== prevState.appClientKey
        ) {
            return {
                tenantId,
                appClientId,
                appClientKey,
            }
        } else {
            return prevState
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            tenantId: '',
            appClientId: '',
            appClientKey: '',
        }
        this.textChangeHandler = this.textChangeHandler.bind(this)
        this.confirmHandler = this.confirmHandler.bind(this)
        this.onEnterKeyDown = this.onEnterKeyDown.bind(this)
    }

    textChangeHandler(e) {
        this.setState({
            ...this.state,
            [e.target.id]: e.target.value,
        })
    }

    confirmHandler() {
        const { loadHandler } = this.props
        loadHandler(this.state)
    }

    onEnterKeyDown(e) {
        if (e && e.key === 'Enter') {
            this.confirmHandler()
        }
    }

    render() {
        const { isLoading, visible, cancelHandler, helpHandler, } = this.props
        const textboxWrapper = {
            padding: '16px 6px 10px',
        }
        const textbox = {
            width: '100%',
            height: '40px',
        }
        return (
            <Modal active={visible}>
                <div style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '800px',
                    maxHeight: '480px',
                    minWidth: '640px',
                    height: '480px',
                    padding: '20px 30px',
                    boxShadow: '0 0 12px 1px #ccc',
                    backgroundColor: '#fff',
                }}
                >
                    <div style={{
                        height: '15%',
                    }}
                    >
                        <h3>
                            Login Azure Active Directory
                            <label style={{ margin: '0 16px', verticalAlign: 'middle', cursor: 'pointer' }} title='what is this?' onClick={helpHandler}>
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                                </svg>
                            </label>
                        </h3>
                    </div>
                    <div style={{
                        height: '70%',
                    }}
                    >
                        <div style={textboxWrapper}><input id='tenantId' type='text' placeholder='Active Directory ID' title='Active Directory ID' style={textbox} onChange={this.textChangeHandler} value={this.state.tenantId} onKeyDown={this.onEnterKeyDown} /></div>
                        <div style={textboxWrapper}><input id='appClientId' type='text' placeholder='Application ID' title='Application ID' style={textbox} onChange={this.textChangeHandler} value={this.state.appClientId} onKeyDown={this.onEnterKeyDown} /></div>
                        <div style={textboxWrapper}><input id='appClientKey' type='text' placeholder='Application Key' title='Application Key' style={textbox} onChange={this.textChangeHandler} value={this.state.appClientKey} onKeyDown={this.onEnterKeyDown} /></div>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        height: '15%',
                    }}
                    >
                        <Button className='btn-primary btn-md modal-btn' onClick={this.confirmHandler} loading={isLoading}>Login</Button>
                        <Button className='btn-default btn-md modal-btn' onClick={cancelHandler}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default UserLoadModal

UserLoadModal.propTypes = {
    isLoading: propTypes.bool.isRequired,
    visible: propTypes.bool.isRequired,
    tenantId: propTypes.string.isRequired,
    appClientId: propTypes.string.isRequired,
    appClientKey: propTypes.string.isRequired,
    loadHandler: propTypes.func.isRequired,
    cancelHandler: propTypes.func.isRequired,
}
