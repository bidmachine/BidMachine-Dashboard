import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect, Dispatch} from 'react-redux';
import * as Select from 'react-select';
import {State} from '../../reducers';
import {SSP} from '../../models/auction/SSP';
import {Field, renderError, simpleValueArray} from '../../lib/form';
import {requestSSPAction} from '../../reducers/SSPSelect';

interface SelectSSPProps extends ClassAttributes<SelectSSPComponent> {
    value?: {
        value: number,
        label: string
    }[];
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
}

interface StateProps {
    loading: boolean;
    sellers: SSP[];
}

interface DispatchProps {
    loadSSP: () => any;
}

export class SelectSSPComponent extends Component<StateProps & DispatchProps & SelectSSPProps, {}> {
    componentDidMount() {
        this.props.loadSSP();
    }

    render() {
        const {value, sellers, loading} = this.props;
        return <Select
            value={value}
            isLoading={loading}
            options={sellers.map(seller => ({
                value: seller.id,
                label: seller.name
            }))}
            multi
            simpleValue
            onChange={this.props.onChange}/>;
    }
}

export const SelectSSP = connect<StateProps, DispatchProps, SelectSSPProps>(
    (state: State) => ({
        loading: state.SSPSelect.loading,
        sellers: state.SSPSelect.sellers.sort((a: SSP, b: SSP) => {
            let [a_name, b_name] = [a.name.toLowerCase(), b.name.toLowerCase()];
            if (a_name < b_name)
                return -1;
            if (a_name > b_name)
                return 1;
            return 0;
        })
    }),
    (dispatch: Dispatch<any>) => ({
        loadSSP: () => dispatch(requestSSPAction())
    })
)(SelectSSPComponent);


export function renderSelectSSPField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <SelectSSP
            onBlur={field.input.onBlur}
            value={field.input.value}
            onChange={(value) => {
                let values = simpleValueArray(value);
                if (values.findIndex(val => val === '1') === -1) {
                    values.push('1');
                }
                return field.input
                    .onChange(values
                        .map(v => Number(v))
                    )
            }
            }
        />
        {renderError(field)}
    </div>;
}
