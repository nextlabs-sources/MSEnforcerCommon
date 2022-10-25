import React from 'react'
import propTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import path2Reg from 'path-to-regexp'
import config from '../../config'

const FileTab = ({
    uid, type, name, handler, tip = '', isActive = false, paddingLeft = '0',
}) => {
    const tabWrapper = {
        height: '40px',
        lineHeight: '40px',
        color: '#06c',
        paddingLeft: paddingLeft || 0,
        borderStyle: 'solid',
        borderWidth: '0 4px 0 0',
        borderColor: isActive ? 'transparent #06c transparent transparent' : 'transparent',
        backgroundColor: isActive ? '#efefef' : '#fff',
        whiteSpace: 'nowrap',
    }

    const defaultHandler = (e) => {
        e.stopPropagation()
        handler && handler(name)
    }
    const getServersPath = path2Reg.compile(config.Routes.servers)

    return (
        <div style={tabWrapper} onClick={defaultHandler} title={tip} role='menuitem'>
            <NavLink to={`${getServersPath({ uid, id: name, type })}`} isActive={() => true} activeStyle={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}>
                {name}
            </NavLink>
        </div>
    )
}
FileTab.contextTypes = {
    app: propTypes.shape({ uid: propTypes.string }),
}

FileTab.propTypes = {
    uid: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    handler: propTypes.func.isRequired,
    tip: propTypes.string,
    isActive: propTypes.bool,
    paddingLeft: propTypes.string,
}

export default FileTab
