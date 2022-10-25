import React, { Component } from 'react'
import propTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import './index.css'

class Menu extends Component {
    static defaultProps = {
        isActive: false,
        padding: '16px 0',
    }

    static setNavLinkActive() {
        return true
    }

    constructor(props) {
        super(props)
        this.state = {
            tab: '',
        }
        this.handler = this.handler.bind(this)
        this.tabHandler = this.tabHandler.bind(this)
    }

    handler() {
        const { name, outterHandler } = this.props

        if (outterHandler) {
            outterHandler(name)
        }
    }

    tabHandler(tabName) {
        this.setState({
            tab: tabName,
        })
    }

    render() {
        const {
            icon, name, link = '', isActive, padding, children = [],
        } = this.props

        const el = (
            <div
                style={{ padding, cursor: 'pointer' }}
                role='menuitem'
                tabIndex={0}
                onClick={this.handler}
            >
                <div
                    style={{
                        height: '40px',
                        lineHeight: '40px',
                        borderRight: isActive ? '4px solid #06c' : '4px solid transparent',
                        backgroundColor: isActive ? '#efefef' : '#fff',
                    }}
                >
                    <img src={icon} alt={name} style={{ maxHeight: '20px', verticalAlign: 'middle', margin: '0 8px' }} />
                    <span style={{ verticalAlign: 'middle' }}>{name}</span>
                    <i className={`arrowIcon ${isActive ? 'uncollapse' : ''}`} style={{ display: React.Children.count(children) ? 'inline-block' : 'none' }}>
                        <svg viewBox='0 0 24 24'>
                            <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" fill="#333" />
                        </svg>
                    </i>
                </div>
                <CSSTransition classNames='dropdown-menu' timeout={300} in={isActive} unmountOnExit>
                    <div className='dropdown-menu'>
                        {
                            React.Children.map(children, (c) => {

                                //arrow function has no arguments prop
                                let handler = function () {
                                    this.tabHandler(c.props.name)
                                    c.props.handler && c.props.handler.apply(c, arguments)
                                }

                                handler = handler.bind(this)

                                return React.cloneElement(c, { isActive: (c.props.name === this.state.tab), handler })
                            })
                        }
                    </div>
                </CSSTransition>
            </div>
        )

        return link ? (<NavLink to={link} isActive={Menu.setNavLinkActive} activeStyle={{ color: '#333' }}>{el}</NavLink>) : el
    }
}

export default Menu

Menu.propTypes = {
    icon: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    outterHandler: propTypes.func.isRequired,
    link: propTypes.string,
    isActive: propTypes.bool,
    padding: propTypes.string,
    children: propTypes.node,
}
