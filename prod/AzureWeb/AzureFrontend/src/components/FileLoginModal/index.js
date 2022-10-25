import React, { Component } from 'react'
import propTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'
import './index.css'

const defaultHandler = () => { }

class FileLoginModal extends Component {
    static defaultProps = {
        visible: false,
        deployHandler: defaultHandler,
        cancelHandler: defaultHandler,
    }

    constructor(props) {
        super(props)
        this.state = {
            fileServer: '',
            fileAccount: '',
            fileAccountKey: '',
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
        deployHandler({
            server: this.state.fileServer,
            account: this.state.fileAccount,
            key: this.state.fileAccountKey,
        })
    }

    onEnterKeyDown(e) {
        if(e && e.key === 'Enter') {
            this.confirmHandler()
        }
    }

    render() {
        const { isLogging, visible, cancelHandler } = this.props
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
                        <h3>Set Proxy for File Server</h3>
                    </div>
                    <div style={{
                        height: '70%',
                    }}
                    >
                        <div style={textboxWrapper}><input id='fileServer' type='text' placeholder='Azure File Host:Port' style={textbox} onChange={this.textChangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                        <div style={textboxWrapper}><input id='fileAccount' type='text' placeholder='Account' style={textbox} onChange={this.textChangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                        <div style={textboxWrapper}><input id='fileAccountKey' type='password' placeholder='Account Key' style={textbox} onChange={this.textChangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        height: '15%',
                    }}
                    >
                        <Button className='btn-primary btn-md file-login-btn' onClick={this.confirmHandler} loading={isLogging}>Deploy</Button>
                        <Button className='btn-default btn-md file-login-btn' onClick={cancelHandler}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default FileLoginModal

FileLoginModal.propTypes = {
    visible: propTypes.bool,
    deployHandler: propTypes.func,
    cancelHandler: propTypes.func,
}
