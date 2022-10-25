import React, { Component } from 'react'
import propTypes from 'prop-types'
import signupBanner from '../../statics/imgs/signup-banner.png'
import powerbyLogo from '../../statics/imgs/power-by.png'
import { Button } from '../../components'

class Signup extends Component {
    constructor(props) {
        super(props)

        this.textchangeHandler = this.textchangeHandler.bind(this)
        this.selectChangeHandler = this.selectChangeHandler.bind(this)
        this.onEnterKeyDown = this.onEnterKeyDown.bind(this)
    }

    state = {
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone: '',
        password: '',
        type: 'azure_sql',
    }

    textchangeHandler(e) {
        const el = e.target
        this.setState({
            [el.id]: el.value,
        })
    }

    selectChangeHandler(e) {
        this.setState({
            type: e.target.value,
        })
    }

    onEnterKeyDown(e) {
        const { signupHandler } = this.props

        if(e && e.key === 'Enter' && signupHandler) {
            signupHandler(this.state)()
        }
    }    

    render() {
        const textboxWrapper = {
            padding: '16px 6px 16px',
        }

        const textbox = {
            width: '100%',
            height: '40px',
        }

        const { isSigningup, isSignedUp, signupHandler } = this.props

        const signupSection = (
            <div>
                <div style={textboxWrapper}><input id='first_name' type='text' placeholder='First Name' style={textbox} value={this.state.first_name} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}><input id='last_name' type='text' placeholder='Last Name' style={textbox} value={this.state.last_name} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}><input id='company' type='text' placeholder='Company' style={textbox} value={this.state.company} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}><input id='email' type='email' placeholder='Email' style={textbox} value={this.state.email} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}><input id='phone' type='tel' placeholder='Phone' style={textbox} value={this.state.phone} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}><input id='password' type='password' placeholder='Password' style={textbox} value={this.state.password} onChange={this.textchangeHandler} onKeyDown={this.onEnterKeyDown}/></div>
                <div style={textboxWrapper}>
                    <select
                        value={this.state.type}
                        onChange={this.selectChangeHandler}
                        style={{
                            fontSize: '16px',
                            padding: '8px 16px',
                        }}
                    >
                        <option value='azure_sql'>Nextlabs Entitlement Management for Azure SQL</option>
                        <option value='azure_file'>Nextlabs Entitlement Management for Azure Files</option>
                    </select>
                </div>
                <div style={{ ...textboxWrapper, padding: '64px 6px' }}>
                    <Button className='btn-primary btn-md' onClick={signupHandler(this.state)} loading={isSigningup}>Sign me up ></Button>
                </div>
            </div>
        )

        const signedUpSection = (
            <div>
                <h3>Thanks for signing up NextLabs Azure Entitlement Management Service</h3>
                <p>An email with instructions has been sent to <strong>{this.state.email}</strong>. If you are missing link emails, please check your email account's Spam or Junk folder to ensure the message was not filtered.</p>
            </div>
        )

        return (
            <div style={{
                height: '100%',
                fontSize: 0,
                minWidth: '1280px', 
                minHeight: '720px',
            }}
            >
                <div style={{
                    display: 'inline-block', verticalAlign: 'top', textAlign: 'center', overflow: 'hidden', width: '40%', height: '100%', boxSizing: 'border-box', padding: '100px 50px 50px', fontSize: '16px',
                }}
                >
                    <figure>
                        <img src={signupBanner} alt='signup banner' style={{ maxWidth: '90%' }} />
                    </figure>
                    <div style={{ padding: '32px 16px' }}>
                        <h2 style={{ fontWeight: 400 }}>NextLabs Azure Entitlement Management Service</h2>
                        <p>Data Centric Security & Attribute Based Access Control in the Cloud</p>
                    </div>
                    <div style={{ padding: '32px 16px' }}>
                        <span style={{ verticalAlign: 'top', margin: '0 16px' }}>Powered By</span>
                        <img src={powerbyLogo} alt='powered by' style={{ maxWidth: '200px', verticalAlign: 'top' }} />
                    </div>
                </div>
                <div style={{
                    display: 'inline-block', verticalAlign: 'top', fontSize: '16px', overflow: 'hidden', width: '60%', height: '100%', backgroundColor: '#fff', boxSizing: 'border-box', padding: '100px 50px 50px',
                }}
                >
                    {
                        !isSignedUp ? signupSection : signedUpSection
                    }
                </div>
            </div>
        )
    }
}

export default Signup

Signup.propTypes = {
    isSigningup: propTypes.bool.isRequired,
    isSignedUp: propTypes.bool.isRequired,
    signupHandler: propTypes.func.isRequired,
}
