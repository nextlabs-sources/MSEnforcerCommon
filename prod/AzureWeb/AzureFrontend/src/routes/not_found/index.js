import React from 'react'
import logo from '../../statics/imgs/404.jpg'

const NotFound = () => (
    <div style={{ textAlign: 'center', height: '100%' }}>
        <img
            src={logo}
            alt='404'
            style={{
                verticalAlign: 'top',
                maxHeight: '512px',
                height: '100%',
                position: 'relative',
                transform: 'translateY(-50%)',
                top: '50%',
            }}
        />
    </div>
)

export default NotFound
