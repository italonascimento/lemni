/// <reference types="react" />
import * as PropTypes from 'prop-types';
import { Component, ReactElement } from 'react';
export interface Props {
    store: any;
    children: JSX.Element;
}
export declare class StoreProvider extends Component<Props> {
    static childContextTypes: {
        store: PropTypes.Requireable<any>;
    };
    getChildContext(): {
        store: any;
    };
    render(): ReactElement<any>;
}
