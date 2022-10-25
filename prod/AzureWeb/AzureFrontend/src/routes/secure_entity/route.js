import React, { Component } from 'react'
import propTypes from 'prop-types'
import { EntityCard } from '../../components'
import './index.css'

class SecureEntity extends Component {
    static defaultHandler() {
        console.log('secure entity route default handler')
    }

    static defaultProps = {
        entities: [],
        checkHandler: SecureEntity.defaultHandler,
        attrCheckHandler: SecureEntity.defaultHandler,
        attrCheckAllHandler: SecureEntity.defaultHandler,
    }

    static childContextTypes = {
        server: propTypes.string,
        database: propTypes.string,
        checkHandler: propTypes.func,
        attrCheckHandler: propTypes.func,
        attrCheckAllHandler: propTypes.func,
    }

    getChildContext() {
        const {
            server, database, checkHandler, attrCheckHandler, attrCheckAllHandler,
        } = this.props

        return {
            server,
            database,
            checkHandler,
            attrCheckHandler,
            attrCheckAllHandler,
        }
    }

    render() {
        const {
            entities, entityClickHandler, pager, loadMoreClickHandler,
        } = this.props
        const { loading, done } = pager

        return (
            <React.Fragment>
                {
                    entities.map(e => (
                        <EntityCard key={`${e.server}/${e.database}/${e.schema}/${e.name}`} entity={e} entityClickHandler={entityClickHandler} />
                    ))
                }
                {
                    !loading ? (
                        <button style={{
                            display: !done ? 'block' : 'none',
                            margin: '16px auto',
                            width: '140px',
                            height: '50px',
                            lineHeight: '50px',
                            textAlign: 'center',
                            fontSize: '16px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            boxShadow: '0 0 4px 1px #ccc'
                        }} onClick={loadMoreClickHandler}>
                            <strong>Load More</strong>
                        </button>
                    ) : (
                            <div style={{ height: '100px', position: 'relative' }}>
                                <div className='load-spinner'></div>
                            </div>
                        )
                }
            </React.Fragment>
        )
    }
}

export default SecureEntity

SecureEntity.propTypes = {
    server: propTypes.string.isRequired,
    database: propTypes.string.isRequired,
    entityClickHandler: propTypes.func.isRequired,
    entities: propTypes.array,
    checkHandler: propTypes.func,
    attrCheckHandler: propTypes.func,
    attrCheckAllHandler: propTypes.func,
}
