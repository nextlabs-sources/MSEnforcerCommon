import React from 'react'
import propTypes from 'prop-types'
import renderer from 'react-test-renderer'
import EntityCard from '../index'
import Checkbox from '../../Checkbox'

const mockContext = {
  server: 'nextlabs.com',
  database: 'cdc',
  checkHandler: jest.fn(),
}
const mockEntity = {
  name: 'Account',
  description: 'Account Mock',
  enforced: true,
  willBeEnforced: true,
}
class ContextProvider extends React.Component {

  static childContextTypes = {
    server: propTypes.string,
    database: propTypes.string,
    checkHandler: propTypes.func,
  }

  getChildContext() {
    const { mockHandler } = this.props
    return {
      ...mockContext,
      checkHandler: mockHandler,
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

describe('EntityCard', () => {
  it('should render checked entity', () => {
    const mockCheckHandler = jest.fn()
    const tree = renderer.create(<ContextProvider mockHandler={mockCheckHandler}><EntityCard entity={{ ...mockEntity }} /></ContextProvider>)
    const instance = tree.root
    const checkboxIns = instance.findByType(Checkbox)

    checkboxIns.props.handler(true)

    expect(tree.toJSON()).toMatchSnapshot()
    expect(checkboxIns).not.toBe(undefined)
    expect(mockCheckHandler.mock.calls.length).toBe(1)
  })

  it('should render unchecked entity', () => {
    const mockCheckHandler = jest.fn()
    const tree = renderer.create(<ContextProvider mockHandler={mockCheckHandler}><EntityCard entity={{ ...mockEntity, enforced: false, willBeEnforced: false }} /></ContextProvider>)
    const instance = tree.root
    const checkboxIns = instance.findByType(Checkbox)

    checkboxIns.props.handler(true)

    expect(tree.toJSON()).toMatchSnapshot()
    expect(checkboxIns).not.toBe(undefined)
    expect(mockCheckHandler.mock.calls.length).toBe(1)
  })
})