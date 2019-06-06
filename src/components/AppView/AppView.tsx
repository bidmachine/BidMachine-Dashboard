import './AppView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

interface AppViewProps extends ClassAttributes<AppView> {
    className?: string;
    padding?: boolean;
    row?: boolean;
    childrenContext?: React.ReactNode;
}

export class AppView extends Component<AppViewProps, {}> {
    static defaultProps = {
        padding: true,
        row: false
    };

    render() {
        if (this.props.childrenContext) {
            return this.props.childrenContext as JSX.Element;
        } else {
            const {padding, row} = this.props;
            const className = 'app-view'
                + (padding ? ' padding' : '')
                + (row ? ' row' : '')
                + (this.props.className ? (' ' + this.props.className) : '');
            return <div className={className}>{this.props.children}</div>;
        }
    }
}
