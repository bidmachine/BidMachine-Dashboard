import './SidebarItem.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Link} from 'react-router';

interface SidebarItemProps extends ClassAttributes<SidebarItem> {
    link?: string;
    label?: string;
    icon?: string;
    iconStyle?: any;
    active?: boolean;
    disabled?: boolean;
    external?: boolean;
}

export class SidebarItem extends Component<SidebarItemProps, {}> {
    render() {
        const {link, label, icon, active, disabled, external} = this.props;
        const classes = ['sidebar-item'];

        if (active) { classes.push('active'); }
        if (disabled) {
            classes.push('disabled');
            return <a className={classes.join(' ')}>
                <i className={icon} style={this.props.iconStyle}/>
                <span>{label}</span>
            </a>;
        } else {
            const inner = [
                <i key="icon" className={icon} style={this.props.iconStyle}/>,
                <span key="label">{label}</span>
            ];
            if (external) {
                return <a href={link} className={classes.join(' ')} target="_blank">{inner}</a>;
            } else {
                return <Link disabled={disabled} to={link} className={classes.join(' ')}>{inner}</Link>;
            }
        }

    }
}
