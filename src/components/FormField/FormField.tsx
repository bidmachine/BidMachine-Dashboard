import './FormField.scss';
import * as React from 'react';
import {ClassAttributes, Component, HTMLAttributes} from 'react';

type FormfieldType = 'text' | 'number' | 'password' | 'email' | 'checkbox';

interface FormFieldProps extends ClassAttributes<FormField>, HTMLAttributes<HTMLDivElement> {
    type?: FormfieldType;
    placeholder?: string;
    value?: any;
    label?: string;
    labelPosition?: 'left' | 'right';
    iconLeft?: JSX.Element;
    iconRight?: JSX.Element;
    borderless?: boolean;
    disabled?: boolean;
    options?: any[];
    onChange?: (value: any) => void;
}

export class FormField extends Component<FormFieldProps, {}> {
    static defaultProps: FormFieldProps = {
        type: 'text',
        placeholder: '',
        labelPosition: 'left'
    };

    render() {
        const {iconLeft, iconRight, labelPosition, borderless} = this.props;
        const fieldClass = 'form-field' + (iconLeft ? ' icon-left' : '') + (iconRight ? ' icon-right' : '') + (borderless ? ' borderless' : '');
        const props = {
            style: this.props.style
        };
        return <div className={fieldClass} {...props}>
            {iconLeft && <div className='icon left'>{iconLeft}</div>}
            {labelPosition === 'left' ? [this.renderLabel(), this.renderInput()] : [this.renderInput(), this.renderLabel()]}
            {iconRight && <div className='icon right'>{iconRight}</div>}
        </div>;
    }

    private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {onChange} = this.props;
        if (onChange) {
            onChange(event.target.value);
        }
    }

    private toggleCheckbox = () => {
        const {onChange, value} = this.props;
        if (onChange) {
            onChange(!value);
        }
    }

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {onChange} = this.props;
        if (onChange) {
            onChange(event.target.checked);
        }
    }

    private renderLabel() {
        const {label, labelPosition} = this.props;
        if (label) {
            return <label className={labelPosition} key='label'>{label}</label>;
        } else {
            return null;
        }
    }

    private renderInput() {
        const {type, value, disabled, placeholder} = this.props;
        switch (type) {
            default:
            case 'text':
            case 'number':
            case 'email':
            case 'password': {
                return <input key='input' disabled={disabled} value={value} placeholder={placeholder} type={type}
                              onChange={this.onInputChange}/>;
            }
            case 'checkbox': {
                return <div key='input' className='checkbox' onClick={this.toggleCheckbox}>
                    <i className={`input-checkbox ion-ios-${value ? 'checkbox' : 'square-outline'}`}/>
                    <input hidden disabled={disabled} checked={value} type={type} onChange={this.onCheckboxChange}/>
                </div>;
            }
        }
    }
}
