import React from 'react'
import renderer from 'react-test-renderer'
import Checkbox from '../index'

describe('Checkbox', () => {
    it('should render checked one', () => {
        const checkHandler = jest.fn()
        const tree = renderer.create(<Checkbox checked={true} handler={checkHandler}/>)
        const instance = tree.root

        instance.props.handler(true)

        expect(tree).toMatchSnapshot()
        expect(checkHandler.mock.calls.length).toBe(1)
        expect(checkHandler.mock.calls[0][0]).toBe(true)
    })

    it('should render unchecked one', () => {
        const checkHandler = jest.fn()
        const tree = renderer.create(<Checkbox checked={false} handler={checkHandler}/>)
        const instance = tree.root

        instance.props.handler(false)

        expect(tree).toMatchSnapshot()
        expect(checkHandler.mock.calls.length).toBe(1)
        expect(checkHandler.mock.calls[0][0]).toBe(false)
    })
})