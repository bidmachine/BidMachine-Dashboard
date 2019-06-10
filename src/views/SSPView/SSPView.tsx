import * as React from 'react';
import {ClassAttributes} from 'react';
import {Link} from 'react-router';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import * as Modal from 'react-modal';

import {State} from '../../reducers';
import {deleteSSPAction, requestSSPAction, toggleSSPAction} from '../../reducers/SSPList';
import {openConfirmYesNo} from '../../reducers/confirm';

import {SSP} from '../../models/auction/SSP';
import {AppView} from '../../components/AppView';
import {SortDirection} from '../../lib/ItemsListState';
import {Column, DataTableSorted} from '../../components/DataTable';
import Button from '../../components/Button';
import {Progress} from '../../components/Progress';
import {CreateSSP} from '../CreateSSP/CreateSSP';

interface SSPViewOwnProps extends ClassAttributes<SSPViewComponent> {
    children?: any;
}

interface SSPViewStateProps {
    loading: boolean;
    sellers: SSP[];
}

interface SSPViewDispatchProps {
    requestSSP: (column?: string, direction?: SortDirection) => any;
    deleteSSP: (id: number) => any;
    toggleSSP: (seller: SSP) => any;
    confirmDeleteSSP: (onOk: () => any) => any;
}

export class SSPViewComponent extends React.Component<SSPViewOwnProps & SSPViewStateProps & SSPViewDispatchProps, {
    createModal?: boolean;
}> {
    state = {
        createModal: false
    };

    private SSPColumns: Column[] = [{
        value: 'id',
        label: 'Id',
        width: 44
    }, {
        value: 'name',
        label: 'SSP Name',
        render: (seller: SSP) => <Link to={`/ssp/${seller.id}`}>{seller.name}</Link>
    }, {
        value: 'ks',
        label: 'Display Manager'
    }, {
        value: 'id',
        label: 'Publisher ID'
    }, {
        value: 'fee',
        label: 'Exchange Fee',
        render: (seller: SSP) => (seller.fee || 0) + '%'
    }, {
        value: 'active',
        label: 'Active',
        width: 100,
        render: (seller: SSP) => <Button
            className='icon'
            style={{color: seller.active ? 'green' : 'red'}}
            iconRight={`fa fa-${seller.active ? 'toggle-on' : 'toggle-off'}`}
            onClick={() => this.props.toggleSSP(seller)}/>
    }, {
        value: '',
        label: '',
        className: 'column-right',
        nosort: true,
        render: (seller: SSP) => <Button
            className='primary small control'
            iconLeft='fa fa-trash'
            onClick={() => this.deleteSSP(seller.id)}>delete</Button>
    }];

    componentDidMount() {
        this.props.requestSSP();
    }

    componentWillReceiveProps(next: SSPViewOwnProps) {
        // if route changed from child to current
        if (this.props.children && !next.children) {
            this.props.requestSSP();
        }
    }

    deleteSSP(id: number) {
        this.props.confirmDeleteSSP(() => this.props.deleteSSP(id));
    }

    renderToolbar() {
        return (
            <div className='toolbar'>
                <div className='title'>SSP</div>
                <div className='flex-space'/>
                <Button className='primary' iconLeft='fa fa-plus-circle' onClick={this.openCreateModal}>Create
                    SSP</Button>
            </div>
        );
    }

    render() {
        const {sellers, loading} = this.props;
        return <AppView childrenContext={this.props.children}>
            {this.renderToolbar()}
            {
                loading
                    ? <Progress/>
                    : <DataTableSorted
                        columns={this.SSPColumns}
                        data={sellers}/>
            }
            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.createModal}
                onRequestClose={this.closeCreateModal}>
                <CreateSSP onCancel={this.closeCreateModal}/>
            </Modal>
        </AppView>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => {
        this.props.requestSSP();
        this.setState({createModal: false} as any);
    }
}

export const SSPView = connect<SSPViewStateProps, SSPViewDispatchProps, SSPViewOwnProps>(
    (state: State) => {
        return {
            loading: state.SSPList.loading,
            sellers: Array.from(state.SSPList.map.values())
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestSSP: () => dispatch(requestSSPAction()),
            deleteSSP: (id: number) => dispatch(deleteSSPAction(id)),
            toggleSSP: (seller: SSP) => dispatch(openConfirmYesNo(
                `${!seller.active ? 'Activate' : 'Deactivate'} SSP?`,
                () => dispatch(toggleSSPAction(seller.id, {...seller, active: !seller.active}))
            )),
            confirmDeleteSSP: (onOk: () => any) => dispatch(openConfirmYesNo('Delete SSP?', onOk))
        };
    }
)(SSPViewComponent);
