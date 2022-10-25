import React, { Component } from 'react'
import propTypes from 'prop-types'
import Checkbox from '../Checkbox'
import './index.css'

class EntityCard extends Component {

    static defaultProps = {
        entity: [],
    }

    static contextTypes = {
        server: propTypes.string,
        database: propTypes.string,
        checkHandler: propTypes.func,
    }

    constructor(props) {
        super(props)
        this.state = {
            collapsed: true,
        }
        this.clickHandler = this.clickHandler.bind(this)
        this.checkHandler = this.checkHandler.bind(this)
    }

    clickHandler(e) {
        this.setState({
            collapsed: !this.state.collapsed,
        })
    }

    checkHandler(checked) {
        const { entity } = this.props
        const { server, database, checkHandler } = this.context

        checkHandler(server, database, entity.schema, entity.name, checked)
    }

    render() {
        const { entity } = this.props

        return (
            <div>
                <div
                    style={{
                        height: '100px',
                        padding: '10px',
                        borderRadius: '4px',
                        boxShadow: '0 0 4px 1px #ccc',
                        margin: '32px 20px',
                        fontSize: '0',
                        cursor: 'pointer',
                        backgroundColor: this.state.collapsed ? '#fff' : 'rgb(250, 250, 250)',
                    }}
                    onClick={this.clickHandler}
                    role='button'
                >
                    <div style={{
                        textAlign: 'center', display: 'inline-block', padding: '1.2em 24px 24px', fontSize: '16px', verticalAlign: 'top',
                    }}
                    >
                        <Checkbox checked={entity.willbeEnforced} handler={this.checkHandler} style={{ width: '24px', height: '24px' }} />
                    </div>
                    <div style={{ textAlign: 'left', display: 'inline-block', fontSize: '16px' }}>
                        <h3 style={{
                            fontWeight: '400', fontSize: 'inherti', color: '#333', marginTop: '1em',
                        }}
                        >
                            {entity.name}
                        </h3>
                        <p style={{ fontSize: '11px', color: '#999' }}>{entity.description}</p>
                    </div>
                </div>
                {/* <CSSTransition classNames='table-uncollapse' in={false} timeout={300} unmountOnExit>
                    <div style={{ margin: '0 20px' }}>
                        <AttributeTable server={server} database={database} table={entity.name} attributes={entity.attributes} />
                    </div>
                </CSSTransition> */}
            </div>
        )
    }
}

export default EntityCard

EntityCard.propTypes = {
    entity: propTypes.objectOf(propTypes.oneOfType([propTypes.any, propTypes.objectOf({
        name: propTypes.string.isRequired,
        description: propTypes.string,
        enforced: propTypes.bool,
        willbeEnforced: propTypes.bool,
    })])).isRequired,
}
