import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect, Dispatch} from 'react-redux';
import * as Select from 'react-select';
import {State} from '../../reducers';
import {requestAgenciesAction} from '../../reducers/agenciesSelect';
import {Agency} from '../../models/auction/Agency';
import {Field, renderError} from '../../lib/form';

interface SelectAgencyProps extends ClassAttributes<SelectAgencyComponent> {
    readonly?: boolean;
    value?: number;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
}

interface StateProps {
    loading: boolean;
    agencies: Agency[];
}

interface DispatchProps {
    loadAgencies: () => any;
}

export class SelectAgencyComponent extends Component<StateProps & DispatchProps & SelectAgencyProps, {}> {
    componentDidMount() {
        this.props.loadAgencies();
    }

    render() {
        return <Select
            disabled={this.props.readonly}
            value={this.props.value}
            isLoading={this.props.loading}
            options={this.props.agencies.map(agency => ({
                value: agency.id,
                label: agency.title
            }))}
            onChange={this.props.onChange}/>;
    }
}

export const SelectAgency = connect<StateProps, DispatchProps, SelectAgencyProps>(
    (state: State) => ({
        loading: state.agenciesSelect.loading,
        agencies: state.agenciesSelect.agencies.sort((a: Agency, b: Agency) => {
            let [a_name, b_name] = [a.title.toLowerCase(), b.title.toLowerCase()];
            if (a_name < b_name)
                return -1;
            if (a_name > b_name)
                return 1;
            return 0;
        })
    }),
    (dispatch: Dispatch<any>) => ({
        loadAgencies: () => dispatch(requestAgenciesAction())
    })
)(SelectAgencyComponent);

export function renderSelectAgencyField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <SelectAgency
            readonly={field.readonly}
            onBlur={field.input.onBlur}
            value={field.input.value}
            onChange={(value: Select.Option) => field.input.onChange(value ? value.value : null)}
        />
        {renderError(field)}
    </div>;
}
