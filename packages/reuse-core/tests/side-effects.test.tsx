import { mount } from 'enzyme'
import 'jest'
import * as React from 'react'
import { spy } from 'sinon'
import sampleCombine from 'xstream/extra/sampleCombine'
import { reuse } from '../src'


interface Props {
  onUpdate: () => void
  update?: number
}


const SideEffectsComp = reuse<Props>(sources => ({
  sideEffect: sources.props
    .map(p => p.update)
    .filter(Boolean)
    .compose(sampleCombine(
      sources.props
        .map(p => p.onUpdate)
    ))
    .map(([_1, _2]) => _2)
    .map(onUpdate =>
      () => {
        onUpdate()
      }
    ),
}))

const onUpdateSpy = spy()

test('Side Effect', () => {
  const wrapper = mount(<SideEffectsComp onUpdate={ onUpdateSpy } />)
  expect(onUpdateSpy.callCount).toBe(0)

  wrapper.setProps({
    update: 1
  })
  expect(onUpdateSpy.callCount).toBe(1)

  wrapper.setProps({
    update: 2
  })
  expect(onUpdateSpy.callCount).toBe(2)

  wrapper.setProps({
    update: 3
  })
  expect(onUpdateSpy.callCount).toBe(3)
})
