import React from 'react'
import propTypes from 'prop-types'

const ProxyPage = ({ serverTitle, proxyTitle, server, proxy }) => {

    const textbox = {
        width: '100%',
        height: '40px',
        borderWidth: '0 0 2px 0',
        borderStyle: 'solid',
        borderColor: '#ccc',
        maxWidth: '800px',
        color: '#333',     
    }

    const group = {
        margin: '30px 0',
    }

    const groupTitle = {
        margin: '1.3em 0 .5em',
    }

    return (
        <div style={{ margin: '0 40px' }}>
            <h3>Proxy Details</h3>
            <div style={group}>
                <h4 style={groupTitle}>{serverTitle}</h4>
                <p type='text' style={textbox}>{server}</p>
            </div>
            <div style={group}>
                <h4 style={groupTitle}>{proxyTitle}</h4>
                <p type='text' style={textbox}>{proxy}</p>
            </div>            
        </div>
    )
}

export default ProxyPage

ProxyPage.propTypes = {
    serverTitle: propTypes.string.isRequired,
    proxyTitle: propTypes.string.isRequired,
    server: propTypes.string.isRequired,
    proxy: propTypes.string.isRequired,
}