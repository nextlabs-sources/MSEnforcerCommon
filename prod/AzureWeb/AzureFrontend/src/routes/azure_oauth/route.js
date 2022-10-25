import React from 'react'
import propTypes from 'prop-types'
import Config from '../../config'
import './index.css'

const OAuth = ({ location = {}, onLoad }) => {
    const { search = '?' } = location
    const queryString = search.slice(1).split('&').reduce((prev, pair) => {
        const key = pair.split('=', 2)[0]
        const val = pair.split('=', 2)[1]

        prev[key] = val
        return prev
    }, {})

    if (queryString.code) {
        onLoad(queryString.code)
        return (
            <div style={{
                position: 'relative',
                verticalAlign: 'top',
                top: '50%',
                transform: 'translateY(-50%)',
            }}
            >
                <p style={{ textAlign: 'center', fontSize: '20px' }}>{Config.Toast.loging}</p>
                <div className='spinner' />
            </div>
        )
    } else {
        return (
            <p>{Config.Toast.oauthError}</p>
        )
    }
}

export default OAuth

OAuth.propTypes = {
    location: propTypes.shape({
        search: propTypes.string.isRequired
    }).isRequired,
    onLoad: propTypes.func.isRequired,
}
