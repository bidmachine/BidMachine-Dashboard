import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect, Dispatch} from 'react-redux';
import Select from 'react-select';
import {State} from '../../reducers';
import {requestBiddersAction} from '../../reducers/biddersSelect';
import {Bidder} from '../../models/auction/Bidder';
import {Field, renderError} from '../../lib/form';

interface SelectBidderProps extends ClassAttributes<SelectBidderComponent> {
    readonly?: boolean;
    value?: number;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
}

interface StateProps {
    loading: boolean;
    bidders: Bidder[];
}

interface DispatchProps {
    loadBidders: () => any;
}

export class SelectBidderComponent extends Component<StateProps & DispatchProps & SelectBidderProps, {}> {
    componentDidMount() {
        this.props.loadBidders();
    }

    render() {
        return <Select
            disabled={this.props.readonly}
            value={this.props.value}
            isLoading={this.props.loading}
            options={this.props.bidders.map(bidder => ({
                value: bidder.id,
                label: bidder.title
            }))}
            onChange={this.props.onChange}/>;
    }
}

export const SelectBidder = connect<StateProps, DispatchProps, SelectBidderProps>(
    (state: State) => ({
        loading: state.biddersSelect.loading,
        bidders: state.biddersSelect.bidders
    }),
    (dispatch: Dispatch<any>) => ({
        loadBidders: () => dispatch(requestBiddersAction())
    })
)(SelectBidderComponent);

export function renderSelectBidderField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <SelectBidder
            readonly={field.readonly}
            onBlur={field.input.onBlur}
            value={field.input.value}
            onChange={(value: Select.Option) => field.input.onChange(value ? value.value : null)}
        />
        {renderError(field)}
    </div>;
}
