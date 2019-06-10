import './Switcher.scss';
import * as React from "react";
import {Component} from "react";

interface SwitcherVariant {
    label: string;
    value: any;
    disabled?: boolean;
}

interface SwitcherProps {
    value: any;
    variants: SwitcherVariant[];
    onChange?: (SwitcherVariant) => void;
}

export class Switcher extends Component<SwitcherProps, {}> {

    onChange(variant: SwitcherVariant) {
        const {onChange} = this.props;
        if (onChange) { onChange(variant); }
    }

    renderVariant(variant: SwitcherVariant) {
        const {value} = this.props;
        const classes = [];
        if (variant.value === value) { classes.push('active'); }
        if (variant.disabled) { classes.push('disabled'); }
        return (
            <li
                key={variant.value}
                className={classes.join(' ')}
                onClick={() => !variant.disabled && this.onChange(variant)}
            >{variant.label}</li>
        );
    }

    render() {
        const {variants} = this.props;
        return (
            <ul className="switcher">
                {variants.map(variant => this.renderVariant(variant))}
            </ul>
        );
    }
}
