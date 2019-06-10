import './Sidebar.scss';
import * as React from 'react';
import {Component} from 'react';

export class Sidebar extends Component {
    render() {
        return <div className='sidebar'>{this.props.children}</div>;
    }
}
