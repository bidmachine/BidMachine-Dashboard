import './Sidebar.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

import {SidebarItem} from './SidebarItem';

interface SidebarProps extends ClassAttributes<Sidebar> {
    children?: SidebarItem[];
};

export class Sidebar extends Component<SidebarProps, {}> {
    render() {
        return <div className='sidebar'>{this.props.children}</div>;
    }
}
