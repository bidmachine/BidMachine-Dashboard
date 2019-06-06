import './CountryFlag.scss';
import * as React from 'react';
import {ClassAttributes, Component, HTMLAttributes} from 'react';

interface CountryFlagProps extends ClassAttributes<CountryFlag>, HTMLAttributes<HTMLSpanElement> {
    code: string;
    name?: string;
    squared?: boolean;
}

export class CountryFlag extends Component<CountryFlagProps, {}> {
    render() {
        const {className, code, squared, name} = this.props;
        const clsName = (className !== undefined ? (className + ' ') : '') + 'flag-icon flag-icon-' + code + (squared ? ' flag-icon-squared' : '');
        return <span className={clsName} title={name || code} style={this.props.style}/>;
    }
}
