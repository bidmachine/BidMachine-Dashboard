import * as React from 'react';
import {Field, reduxForm} from 'redux-form';
import {validateSSP} from '../../models/auction/SSP';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {State} from '../../reducers';
import {renderField} from '../../lib/form';
import {Button} from '../../components/Button';

export class SSPFormComponent extends React.Component<any, {}> {
    getNewLocation = () => {
        if (location.pathname.indexOf('ssp') > -1) {
            return '/clients';
        }
        const newPath = location.pathname.split('/').slice(0, -1).join('/');
        return newPath
    }

    render() {
        const {handleSubmit, submitting} = this.props;
        return <form className='model-form' onSubmit={handleSubmit}>
            <Field name='name' component={renderField} type='text' label='SSP name'/>
            <Field name='ks' component={renderField} type='text' label='Display Manager'/>
            <Field name='fee' parse={value => Number(value)} component={renderField} type='number'
                   label='Exchange Fee'/>

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

export const SSPSimpleForm = reduxForm({
    form: 'seller',
    validate: validateSSP
})(SSPFormComponent);

export const SSPForm = connect<{ errorMessage: string | null }, {}, any>((state: State, props) => {
    return {
        ...props,
        errorMessage: state.SSPList.errorMessage
    };
})(SSPSimpleForm);
