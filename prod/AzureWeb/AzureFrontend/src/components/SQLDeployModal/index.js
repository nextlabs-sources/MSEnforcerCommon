import React, { Component } from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'
import './index.css'

class SQLDeployModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            server: '',
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
        const { deployHandler } = this.props
        deployHandler(this.state)
    }

    onEnterKeyDown(e) {
        if(e && e.key === 'Enter') {
            this.confirmHandler()
        }
    }

    render() {
        const { isDeploying, visible, cancelHandler } = this.props
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
                    height: '360px',
                    padding: '20px 30px',
                    boxShadow: '0 0 12px 1px #ccc',
                    backgroundColor: '#fff',
                }}
                >
                    <div style={{
                        height: '15%',
                    }}
                    >
                        <h3>Set Proxy for SQL Servers</h3>
                    </div>
                    <div style={{
                        height: '50%',
                    }}
                    >
                        <div style={textboxWrapper}><input id='server' type='text' placeholder='SQL Server Host:Port' style={textbox} onChange={this.textChangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        height: '35%',
                    }}
                    >
                        <Button className='btn-primary btn-md sql-login-btn' onClick={this.confirmHandler} loading={isDeploying}>Deploy</Button>
                        <Button className='btn-default btn-md sql-login-btn' onClick={cancelHandler}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default SQLDeployModal

SQLDeployModal.propTypes = {
    isDeploying: propTypes.bool.isRequired,
    visible: propTypes.bool.isRequired,
    deployHandler: propTypes.func.isRequired,
    cancelHandler: propTypes.func.isRequired,
}
