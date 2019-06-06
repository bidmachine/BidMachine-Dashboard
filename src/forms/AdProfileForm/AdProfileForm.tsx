import * as React from 'react';
import {Field} from 'redux-form';

import {renderByTemplate, renderField} from '../../lib/form';
import {Button} from '../../components/Button';
import {renderSelectBidderField} from '../../components/SelectBidder';
import {templatesForSelect} from "../../models/auction/AdProfieleTempate";

export class AdProfileForm extends React.Component<any, {}> {

    render() {
        const {handleSubmit, children, readonlyProfile, onCancel, submitting, template} = this.props;
        const type = this.props.form.slice(0, this.props.form.length - 9).toLowerCase();
        const templates = templatesForSelect.filter(val => {
            if (type === 'banner') return val.label.toLowerCase().indexOf(type) > -1 || val.label.toLowerCase().indexOf('interstitial') > -1 ? val : null;
            return val.label.toLowerCase().indexOf(type) > -1 ? val : null;
        });
        return <form className='model-form' onSubmit={handleSubmit}>
            <Field
                component={renderByTemplate(template, renderSelectBidderField)}
                name='bidderId'
                type='text'
                label='Bidder'
                readonly={readonlyProfile}/>

            <Field
                component={renderByTemplate(template, renderField)}
                disabled={!this.props.adProfile}
                name='template'
                type='select'
                label='Template'
                options={templates}
                formName={this.props.form}/>

            <Field component={renderByTemplate(template, renderField)} name='interstitial' type='checkbox'
                   label='Interstitial'/>
            <Field component={renderByTemplate(template, renderField)} name='debug' type='checkbox' label='Debug'/>
            <Field component={renderByTemplate(template, renderField)} name='allowCache' type='checkbox'
                   label='Caching'/>
            <Field component={renderByTemplate(template, renderField)} name='allowCloseDelay' type='number'
                   label='Close time'/>
            <Field component={renderByTemplate(template, renderField)} name='reward' type='checkbox' label='Rewared'/>
            <Field component={renderByTemplate(template, renderField)} name='delayedNotification' type='checkbox'
                   label='Delayed Notification'/>
            <Field component={renderByTemplate(template, renderField)} name='title' type='text' label='Title'/>

            {children}

            <div className='form-field'>
                <label/>
                <div className='form-controls'>
                    <Button className='primary' disabled={submitting} type='submit'>Save</Button>
                    <Button onClick={onCancel} type='button'>Cancel</Button>
                </div>
            </div>
        </form>;
    }
}
