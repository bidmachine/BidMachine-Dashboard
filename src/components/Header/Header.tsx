import './Header.scss';
import * as React from 'react';
import {ClassAttributes, Component, HTMLAttributes} from 'react';

interface HeaderProps extends ClassAttributes<Header>, HTMLAttributes<HTMLDivElement> {

}

export class Header extends Component<HeaderProps, {}> {
    render() {
        const headerProps = this.props as HTMLAttributes<HTMLDivElement>;
        const className = 'header' + (this.props.className ? ` ${this.props.className}` : '');
        return <div className={className} {...headerProps}>{this.props.children}</div>;
    }
}
