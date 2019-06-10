import './Button.scss';
import * as React from 'react';
import {ButtonHTMLAttributes, ClassAttributes, Component} from 'react';
import {Link} from "react-router";

type ButtonIcon = string | JSX.Element;

interface ButtonProps extends ClassAttributes<Button>, ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    target?: string;
    iconLeft?: ButtonIcon;
    iconRight?: ButtonIcon;
}

function renderIcon(icon: ButtonIcon, key) {
    switch (typeof icon) {
    case 'object': {
        return icon;
    }
    case 'string': {
        return <i key={key} className={icon as string}/>;
    }
    default: {
        return null;
    }
    }
}

export class Button extends Component<ButtonProps, {}> {
    static defaultProps = {
        className: 'default'
    };

    render() {
        const {iconLeft, iconRight, href, disabled, children} = this.props;
        const className = 'button' + ` ${this.props.className}`;
        const props = {
            disabled,
            className,
            style: this.props.style,
        };
        const content = [
            iconLeft && renderIcon(iconLeft, 'left'),
            children && <span key='content'>{this.props.children}</span>,
            iconRight && renderIcon(iconRight, 'right')
        ];
        if (href) {
            return <Link {...props} to={href} target={this.props.target}>
                {content}
            </Link>;
        }
        return <button type={this.props.type} {...props} onClick={this.props.onClick}>
            {content}
        </button>;
    }
}
