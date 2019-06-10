import * as React from 'react';
import {Field, FormSection} from 'redux-form';
import * as rtb from '../../models/rtb';
import {renderByTemplate, renderField} from '../../lib/form';

export class NativeAdSection extends React.Component<any, {}> {
    render() {
        const {template} = this.props;
        return <FormSection name='ad'>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='ver'
                type='select'
                label='Version'
                options={[{value: '1.0', label: '1.1'}, {value: '1.1', label: '1.1'}]}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='api'
                type='multiselect'
                label='Api Frameworks'
                options={rtb.apiFrameworks}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='battr'
                type='multiselect'
                label='Blocked Creative Attributes'
                options={rtb.creativeAttributes}/>
        </FormSection>;
    }
}
