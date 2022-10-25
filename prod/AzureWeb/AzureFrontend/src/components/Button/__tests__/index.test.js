import React from 'react'
import renderer from 'react-test-renderer'
import Button from '../index'


describe('Button', () => {
    it('should render loading element <i/>', () => {
        const btnClickHandler = jest.fn()
        const tree = renderer.create(<Button className={'test-class'} loading={true} onClick={btnClickHandler}>TestButton</Button>).toJSON()

        expect(tree).toMatchSnapshot()
        expect(tree.props.onClick).toBe(null)
    })
    
    it('should not render loading element <i/>', () => {
        const btnClickHandler = jest.fn()
        const tree = renderer.create(<Button className={'test-class'} loading={false} onClick={btnClickHandler}>TestButton</Button>).toJSON()

        tree.props.onClick()

        expect(tree).toMatchSnapshot()
        expect(btnClickHandler.mock.calls.length).toBe(1) 
    })
})
