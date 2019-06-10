// import './Dropdown.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

interface DropdownProps extends ClassAttributes<Dropdown> {

}

export class Dropdown extends Component<DropdownProps, {}> {
    render() {
        return <div className='dropdown'>dropdown</div>;
    }
}
