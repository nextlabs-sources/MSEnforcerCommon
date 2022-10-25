import React from 'react'
import propTypes from 'prop-types'
import logo from '../../statics/imgs/nextlabs-logo-white.png'

const Navbar = ({ isLoggedIn = false, logoutHandler }) => {
    const style = {
        height: '30px',
        backgroundColor: '#333',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
    }

    return (
        <nav style={style}>
            <img
                src={logo}
                alt='Nextlabs'
                style={{
                    height: '80%',
                    verticalAlign: 'top',
                    margin: 'auto 10px',
                    transform: 'translateY(10%)',
                }}
            />
            <span
                role='button'
                onClick={logoutHandler}
                tabIndex={0}
                style={{
                    float: 'right',
                    padding: '0 16px',
                    verticalAlign: 'middle',
                    height: '100%',
                    lineHeight: '30px',
                    color: '#fff',
                    display: isLoggedIn ? 'inline-block' : 'none',
                    cursor: 'pointer',
                }}
            >{'Log out'}
            </span>
        </nav>
    )
}

export default Navbar

Navbar.propTypes = {
    isLoggedIn: propTypes.bool,
    logoutHandler: propTypes.func.isRequired,
}
