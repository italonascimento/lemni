import * as PropTypes from 'prop-types';
import { Children, Component } from 'react';
export class StoreProvider extends Component {
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return Children.only(this.props.children);
    }
}
StoreProvider.childContextTypes = {
    store: PropTypes.object
};
//# sourceMappingURL=StoreProvider.js.map