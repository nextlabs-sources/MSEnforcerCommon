import React, { Component } from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'
import './index.css'

class SQLLoginModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sqlUser: '',
            sqlPwd: '',
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
        const { server, connectHandler } = this.props
        connectHandler({
            server,
            user: this.state.sqlUser,
            password: this.state.sqlPwd,
        })
    }

    onEnterKeyDown(e) {
        if(e && e.key === 'Enter') {
            this.confirmHandler()
        }
    }

    render() {
        const { isLogging, server, visible, cancelHandler } = this.props
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
                        <h3>Connect to SQL Server Instance</h3>
                    </div>
                    <div style={{
                        height: '70%',
                    }}
                    >
                        <div style={textboxWrapper}><p style={textbox}>{server}</p></div>
                        <div style={textboxWrapper}><input id='sqlUser' type='text' placeholder='User Name' style={textbox} onChange={this.textChangeHandler} value={this.state.sqlUser} onKeyDown={this.onEnterKeyDown}/></div>
                        <div style={textboxWrapper}><input id='sqlPwd' type='password' placeholder='Password' style={textbox} onChange={this.textChangeHandler} value={this.state.sqlPwd} onKeyDown={this.onEnterKeyDown}/></div>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        height: '15%',
                    }}
                    >
                        <Button className='btn-primary btn-md sql-login-btn' onClick={this.confirmHandler} loading={isLogging}>Connect</Button>
                        <Button className='btn-default btn-md sql-login-btn' onClick={cancelHandler}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default SQLLoginModal

SQLLoginModal.propTypes = {
    server: propTypes.string.isRequired,
    isLogging: propTypes.bool.isRequired,
    visible: propTypes.bool.isRequired,
    connectHandler: propTypes.func.isRequired,
    cancelHandler: propTypes.func.isRequired,
}
