import * as React from 'react';
import {ClassAttributes} from 'react';
import {Link} from 'react-router';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import * as Modal from 'react-modal';

import {State} from '../../reducers';
import {deleteAgencyAction, requestAgenciesAction, toggleAgencyAction} from '../../reducers/agenciesList';
import {openConfirmYesNo} from '../../reducers/confirm';

import {Agency} from '../../models/auction/Agency';
import {AppView} from '../../components/AppView';
import {SortDirection} from '../../lib/ItemsListState';
import {Column, DataTableSorted} from '../../components/DataTable';
import Button from '../../components/Button';
import {Progress} from '../../components/Progress';
import {AgencyWizardView} from '../AgencyWizardView/AgencyWizardView';

interface AgenciesViewOwnProps extends ClassAttributes<AgenciesViewComponent> {
    children?: any;
}

interface AgenciesViewStateProps {
    loading: boolean;
    agencies: Agency[];
}

interface AgenciesViewDispatchProps {
    requestAgencies: (column?: string, direction?: SortDirection) => any;
    deleteAgency: (id: number) => any;
    toggleAgency: (id: number, active: boolean) => any;
    confirmDeleteAgency: (onOk: () => any) => any;
}

export class AgenciesViewComponent extends React.Component<AgenciesViewStateProps & AgenciesViewDispatchProps & AgenciesViewOwnProps, {
    createModal?: boolean;
}> {
    state = {
        createModal: false
    };

    private agencyColumns: Column[] = [{
        value: 'id',
        label: 'Id',
        width: 44
    }, {
        value: 'title',
        label: 'Title',
        render: (agency: Agency) => <Link to={`/agencies/${agency.id}`}>{agency.title}</Link>
    }, {
        value: 'externalId',
        label: 'External id',
        width: 200
    }, {
        value: 'active',
        label: 'Active',
        width: 100,
        render: (agency: Agency) => <Button
            className='icon'
            style={{color: agency.active ? 'green' : 'red'}}
            iconRight={`fa fa-${agency.active ? 'toggle-on' : 'toggle-off'}`}
            onClick={() => this.props.toggleAgency(agency.id, !agency.active)}/>
    }, {
        value: '',
        label: '',
        className: 'column-right',
        nosort: true,
        render: (agency: Agency) => <Button
            className='primary small control'
            iconLeft='fa fa-trash'
            onClick={() => this.deleteAgency(agency.id)}>delete</Button>
    }];

    componentDidMount() {
        this.props.requestAgencies();
    }

    componentWillReceiveProps(next: AgenciesViewOwnProps) {
        // if route changed from child to current
        if (this.props.children && !next.children) {
            this.props.requestAgencies();
        }
    }

    deleteAgency(id: number) {
        this.props.confirmDeleteAgency(() => this.props.deleteAgency(id));
    }

    renderToolbar() {
        return (
            <div className='toolbar'>
                <div className='title'>Agencies</div>
                <div className='flex-space'/>
                <Button className='primary' iconLeft='fa fa-plus-circle' onClick={this.openCreateModal}>Create
                    agency</Button>
            </div>
        );
    }

    render() {
        const {agencies, loading} = this.props;
        return <AppView childrenContext={this.props.children}>
            {this.renderToolbar()}
            {
                loading
                    ? <Progress/>
                    : <DataTableSorted
                        columns={this.agencyColumns}
                        data={agencies}/>
            }
            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.createModal}
                onRequestClose={this.closeCreateModal}>
                <AgencyWizardView onCancel={this.closeCreateModal}/>
            </Modal>
        </AppView>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => {
        this.props.requestAgencies();
        this.setState({createModal: false} as any);
    }
}

export const AgenciesView = connect<AgenciesViewStateProps, AgenciesViewDispatchProps, AgenciesViewOwnProps>(
    (state: State) => {
        return {
            loading: state.agenciesList.loading,
            agencies: Array.from(state.agenciesList.map.values())
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestAgencies: () => dispatch(requestAgenciesAction()),
            deleteAgency: (id: number) => dispatch(deleteAgencyAction(id)),
            toggleAgency: (id: number, active: boolean) => dispatch(openConfirmYesNo(`${active ? 'Activate' : 'Deactivate'} agency?`, () => {
                dispatch(toggleAgencyAction(id, active));
            })),
            confirmDeleteAgency: (onOk: () => any) => dispatch(openConfirmYesNo('Delete Agency?', onOk))
        };
    }
)(AgenciesViewComponent);
