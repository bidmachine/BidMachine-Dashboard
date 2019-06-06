import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Confirm} from "../../components/Confirm/Confirm";

import {State} from '../../reducers';
import {requestAgencyAction, updateAgencyAction} from '../../reducers/agenciesList';

import {Agency} from '../../models/auction/Agency';
import {AppView} from '../../components/AppView';
import {AgencyFormEdit} from '../../forms/AgencyForm';
import {Progress} from '../../components/Progress';
import {AgencyBiddersView} from './AgencyBiddersView';

interface AgencyViewProps extends ClassAttributes<AgencyViewComponent> {
    params: any;
}

interface AgencyViewStateProps {
    loading: boolean;
    agency: Agency;
}

interface AgencyViewDispatchProps {
    requestAgency: (id: number) => any;
    updateAgency: (id: number, agency: Agency) => any;
}

export class AgencyViewComponent extends Component<AgencyViewProps & AgencyViewStateProps & AgencyViewDispatchProps, {}> {
    componentDidMount() {
        this.loadAgency(this.props.params.id);
    }

    componentWillReceiveProps(next: AgencyViewProps) {
        if (this.props.params.id !== next.params.id) {
            this.loadAgency(next.params.id);
        }
    }

    render() {
        const {agency, loading} = this.props;
        if (agency) {
            return <AppView childrenContext={this.props.children}>
                {
                    loading
                        ? <Progress/>
                        : <div>
                            <h1>Agency</h1>
                            <AgencyFormEdit onSubmit={this.updateAgency}/>
                            <AgencyBiddersView agencyId={agency.id}/>
                        </div>
                }
                <Confirm/>
            </AppView>;
        } else {
            return null;
        }
    }

    private updateAgency = (agency: Agency) => {
        this.props.updateAgency(this.props.params.id, agency);
    };

    private loadAgency(id) {
        this.props.requestAgency(id);
    }
}

export const AgencyView = connect<AgencyViewStateProps, AgencyViewDispatchProps, AgencyViewProps>(
    (state: State) => {
        return {
            loading: state.agenciesList.loadingSelected,
            agency: state.agenciesList.selected
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestAgency: (id: number) => dispatch(requestAgencyAction(id)),
            updateAgency: (id: number, agency: Agency) => dispatch(updateAgencyAction(id, agency))
        };
    }
)(AgencyViewComponent);
