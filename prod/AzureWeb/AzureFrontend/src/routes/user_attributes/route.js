import React, { Component } from 'react'
import Header from './header'
import Row from './row'

class UserAttributes extends Component {
    constructor(props) {
        super(props)
        this.props.init && this.props.init()
    }

    render() {
        const { attributes = [], checkHandler, checkAllHandler, } = this.props    
        const attrNames = attributes.map(a => a.name)
        return (
            <div>
                <Header isAllChecked={(attributes.filter(a => a.willbeEnforced).length === attributes.length) && attributes.length !== 0} checkHandler={checkAllHandler(attrNames)} />
                {
                    attributes.map(a => <Row key={a.name} attribute={a} checkHandler={checkHandler} />)
                }
            </div>
        )        
    }
}

export default UserAttributes
