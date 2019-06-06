import * as React from 'react';
import * as Select from 'react-select';
import {FieldConfig, templateById} from "../models/auction/AdProfieleTempate";
import {change, untouch} from 'redux-form';
import {store} from '../index';

export interface FieldMeta {
    touched: any;
    error: any;
    warning: any;
}

export interface Field {
    input: any;
    label: string;
    type: string;
    meta: FieldMeta;

    [key: string]: any;
}

export function renderError(field: Field) {
    return field.meta.touched && (
        (field.meta.error && <span className='error'>{field.meta.error}</span>) ||
        (field.meta.warning && <span className='warning'>{field.meta.warning}</span>)
    );
}

export function simpleValueArray(value: string) {
    if (value !== undefined && value !== null) {
        return value === '' ? [] : value.split(',');
    } else {
        return [];
    }
}

export function renderSelectField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <Select
            disabled={field.disabled}
            clearable={!field.disabled}
            placeholder={field.label}
            value={field.input.value}
            options={field.options}
            onChange={(v: Select.Option) => {
                if (field.label.toLowerCase() === 'template') {
                    const template = templateById(v.value.toString());
                    const fields = Object.keys(template.fields);
                    fields.forEach(val => {
                        if (val !== 'title') {
                            store.dispatch(change(field.formName, val, template.fields[val].value));
                            store.dispatch(untouch(field.formName, val));
                        }
                    });
                }
                const value = v ? (field.numeric ? Number(v.value) : v.value) : null;
                return field.input.onChange(value);
            }}
        />
        {renderError(field)}
    </div>;
}

export function renderMultiSelectField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <Select
            disabled={field.input.disabled}
            placeholder={field.label}
            value={field.input.value}
            options={field.options}
            simpleValue
            multi
            onChange={(value: string) => field.input.onChange(simpleValueArray(value))}
        />
        {renderError(field)}
    </div>;
}

export function renderMultiSelectNumericField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <Select
            disabled={field.input.disabled}
            placeholder={field.label}
            value={field.input.value.map ? field.input.value.map(v => String(v)) : field.input.value}
            options={field.options.map(option => ({
                value: String(option.value),
                label: option.label
            }))}
            simpleValue
            multi
            onChange={(value: string) => field.input
                .onChange(simpleValueArray(value)
                    .map(v => Number(v))
                )}
        />
        {renderError(field)}
    </div>;
}

export function renderField({input, meta, ...custom}) {
    let field = {
        input: input,
        meta: meta as FieldMeta,
        ...custom
    } as Field;
    switch (field.type) {
        case 'multiselect': {
            if (field.numeric) {
                return renderMultiSelectNumericField(field);
            } else {
                return renderMultiSelectField(field);
            }
        }
        case 'select': {
            return renderSelectField(field);
        }
        case 'checkbox': {
            return <div className='form-field'>
                <label>{field.label}</label>
                <div
                    key='input'
                    className='checkbox'
                    onClick={() => {
                        if (!field.input.disabled && !field.disabled) field.input.onChange(!field.input.value)
                    }}>
                    {field.switcher
                        ? <i style={{color: field.input.value ? 'green' : 'red'}}
                             className={`input-checkbox fa fa-${field.input.value ? 'toggle-on' : 'toggle-off'}`}/>
                        : <i className={`input-checkbox ion-ios-${field.input.value ? 'checkbox' : 'square-outline'}`}/>
                    }
                    <input hidden disabled={field.disabled} checked={field.input.value} type={field.type}
                           onChange={() => field.input.onChange(!field.input.value)}/>
                </div>
                {renderError(field)}
            </div>;
        }
        case 'ext': {
            return <input disabled={field.input.disabled} {...custom} {...field.input} placeholder={field.placeholder}
                          type='text'/>
        }
        default: {
            return <div className='form-field'>
                <label>{field.label}</label>
                <input {...custom} disabled={field.disabled} {...field.input} placeholder={field.label}
                       type={field.type}/>
                {renderError(field)}
            </div>;
        }
    }
}

export function renderByTemplate(template, component) {
    return (field: Field) => {
        if (template) {
            const config = template.fields[field.input.name] as FieldConfig;
            if (!config) return component(field); // If config not defined
            if (config.hidden) return null;
            field.input.disabled = config.disabled;
        }
        return component(field)
    }
}
