import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Button } from '../../components'
import logo from '../../statics/imgs/nextlabs-logo-black.png'
import promo from '../../statics/imgs/promo-001.png'
import azureLogo from '../../statics/imgs/azure-logo.png'

const textboxWrapper = {
    padding: '16px 6px 4px',
}

const textbox = {
    width: '100%',
    height: '40px',
}

class Login extends Component {
    constructor(props) {
        super(props)
        const { addLoginClient, match: { params: { uid, type } } } = props

        this.textchangeHandler = this.textchangeHandler.bind(this)
        this.onEnterKeyDown = this.onEnterKeyDown.bind(this)

        if (uid && addLoginClient) {
            addLoginClient(uid, type)
        }
    }

    state = {
        user: '',
        password: '',
    }

    textchangeHandler(e) {
        const el = e.target
        this.setState({
            [el.id]: el.value,
        })
    }

    onEnterKeyDown(e) {
        const { loginHandler } = this.props
        if(e && e.key === 'Enter' && loginHandler) {
            loginHandler(this.state.user, this.state.password)()
        }
    }

    render() {
        const { isLogging, loginHandler, match: { params: { type } } } = this.props

        return (
            <div style={{ height: '100%', fontSize: 0, minWidth: '1280px', minHeight: '720px' }}>
                <div style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    width: '40%',
                    height: '100%',
                }}
                >
                    <div style={{
                        height: '100px',
                        margin: '0',
                        padding: '0',
                    }}
                    >
                        <img src={logo} alt='logo' style={{ height: '24px', padding: '50px 0 0 50px' }} />
                    </div>
                    <div style={{
                        textAlign: 'center',
                    }}
                    >
                        <figure>
                            <img
                                src={promo}
                                alt='logo'
                                style={{
                                    maxWidth: '60%',
                                }}
                            />
                            <figcaption style={{
                                fontSize: '33px',
                                padding: '20px',
                            }}
                            >
                                <p>Welcome to</p>
                                <h3 style={{ fontWeight: 400 }}>{ type === 'azure_sql' ? 'Nextlabs Entitlement Management for Azure SQL' : 'Nextlabs Entitlement Management for Azure Files' }</h3>
                            </figcaption>
                        </figure>
                    </div>
                </div>
                <div style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    width: '60%',
                    height: '100%',
                    backgroundColor: '#fff',
                }}
                >
                    <div style={{
                        padding: '100px 50px 50px',
                    }}
                    >
                        <figure style={{ paddingBottom: '30px', margin: '0' }}>
                            <img src={azureLogo} alt='logo' style={{ maxHeight: '60px' }} />
                        </figure>
                        <div style={{ maxWidth: '50%', fontSize: '16px' }}>
                            <div style={textboxWrapper}><input id='user' type='text' placeholder='User Name' style={textbox} value={this.state.user} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                            <div style={textboxWrapper}><input id='password' type='password' placeholder='Password' style={textbox} value={this.state.password} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                            <div style={textboxWrapper}>
                                <Button className='btn-primary btn-md' onClick={loginHandler(this.state.user, this.state.password)} loading={isLogging}>Login</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login

Login.propTypes = {
    addLoginClient: propTypes.func.isRequired,
    loginHandler: propTypes.func.isRequired,
}
