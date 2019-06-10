import * as React from 'react';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {auctionTypes, defaultBidder, labels, validateBidder} from '../../models/auction/Bidder';
import {versions} from '../../models/rtb/Version';
import {platforms} from '../../models/Platform';
import {renderField} from '../../lib/form';
import {countries} from '../../lib/countries';
import {connect} from 'react-redux';
import {State} from '../../reducers';

import {Button} from '../../components/Button';
import {renderSelectAgencyField} from '../../components/SelectAgency';
import {renderSelectSSPField} from '../../components/SelectSSP';
import {browserHistory} from 'react-router';
import {Networks} from "../../models/rtb";

/**
 * Bidder form stateles component
 */
export class BidderFormComponent extends React.Component<any, {}> {
    titleDisabled() {
        const {initialValues} = this.props;
        return !!initialValues.id;
    }

    getNewLocation = () => {
        return location.pathname.split('/').slice(0, -1).join('/');
    }

    render() {
        const {handleSubmit, readonlyAgency, worldwide, submitting} = this.props;
        return <form className='model-form' onSubmit={handleSubmit}>
            <Field
                component={renderSelectAgencyField}
                name='agencyId'
                type='text'
                label='Agency'
                readonly={readonlyAgency}/>

            <Field component={renderField} name='title' type='text' label='Bidder title'
                   disabled={this.titleDisabled()}/>
            <Field component={renderField} name='endpoint' type='text' label='Endpoint'
                   disabled={this.titleDisabled()}/>
            <Field
                component={renderField}
                name='rtbVersion'
                type='select'
                label='RTB version'
                disabled={this.titleDisabled()}
                options={versions.map(v => ({
                    value: v,
                    label: String(v).split('').join(','),
                    disabled: this.titleDisabled()
                }))}/>

            <Field
                component={renderSelectSSPField}
                name='includedSellers'
                type='text'
                label='SSP'
            />
            <Field component={renderField} name='coppaFlag' type='checkbox' label='Coppa flag'
                   disabled={this.titleDisabled()}/>
            <Field component={renderField} name='worldwide' type='checkbox' label='Worldwide'/>
            <Field
                disabled={worldwide}
                component={renderField}
                name='countries'
                type='multiselect'
                label='Countries'
                options={countries.map(c => ({
                    value: c.code3,
                    label: c.name,
                    disabled: worldwide
                }))}/>
            <Field
                component={renderField}
                name='platforms'
                type='multiselect'
                label='Platforms'
                options={platforms.map(platform => ({
                    value: platform,
                    label: platform
                }))}/>
            <Field
                component={renderField}
                name='protocol'
                type='select'
                label='Protocol'
                options={Networks.map(network => ({
                    value: network,
                    label: network
                }))}/>
            <Field
                component={renderField}
                name='auctionType'
                type='select'
                label='Auction Type'
                options={auctionTypes}/>
            <Field component={renderField} name='maxRpm' type='number' min='0' label={labels.get('maxRpm')}
                   disabled={this.titleDisabled()}/>
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

/**
 * Bidder redux-form
 */

export const BidderSimpleForm = reduxForm({
    form: 'bidder',
    initialValues: defaultBidder,
    validate: validateBidder
})(BidderFormComponent);

export const selector = formValueSelector('bidder');

export const BidderForm = connect<{ errorMessage: string | null }, {}, { onSubmit?: any, onCancel?: any }>((state: State, props) => {
    const worldwide = selector(state, 'worldwide');
    return {
        worldwide,
        ...props,
        initialValues: defaultBidder,
        errorMessage: state.agencyWizard.errorMessage || state.biddersList.errorMessage
    };
})(BidderSimpleForm);
