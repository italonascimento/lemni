import * as PropTypes from 'prop-types'
import {
  Children,
  Component,
  ReactElement
} from 'react'


export interface Props {
  store: any
  children: JSX.Element
}


export class StoreProvider extends Component<Props> {
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render(): ReactElement<any> {
    return Children.only(this.props.children)
  }
}
