import * as React from 'react';
import {Field, reduxForm} from 'redux-form';
import {validateAgency} from '../../models/auction/Agency';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {State} from '../../reducers';
import {renderField} from '../../lib/form';
import {Button} from '../../components/Button';


export class AgencyFormComponent extends React.Component<any, {}> {
    getNewLocation = () => {
        if ((location.pathname.indexOf('/agencies') === 0)) {
            return '/clients';
        }
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    render() {
        const {handleSubmit, submitting} = this.props;
        return <form className='model-form' onSubmit={handleSubmit}>
            <Field name='title' component={renderField} type='text' label='Agency title'/>

            <Field name='contactName' component={renderField} type='text' label='Contact Name'/>
            <Field name='instantMessaging' component={renderField} type='text' label='Instant Messaging'/>
            <Field name='phone' component={renderField} type='text' label='Phone'/>
            <Field name='email' component={renderField} type='text' label='Email'/>
            <Field name='site' component={renderField} type='text' label='Site'/>

            <div className='form-field'>
                <label/>
                <div className='form-controls'>
                    <Button className='primary' disabled={submitting} type='submit'>Save</Button>
                    <Button
                        onClick={() => this.props.onCancel ? this.props.onCancel() : browserHistory.push(this.getNewLocation())}
                        type='button'>Cancel</Button>
                </div>
            </div>
            <div className='form-field error'>
                <label/>
                {this.props.errorMessage}
            </div>
        </form>;
    }
}

export const AgencySimpleForm = reduxForm({
    form: 'agency',
    validate: validateAgency
})(AgencyFormComponent);

export const AgencyForm = connect<{ errorMessage: string | null }, {}, any>((state: State, props) => {
    return {
        ...props,
        errorMessage: state.agencyWizard.errorMessage
    };
})(AgencySimpleForm);
