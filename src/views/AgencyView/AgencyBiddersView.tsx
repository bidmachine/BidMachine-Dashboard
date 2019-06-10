// import './BiddersView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import * as Modal from 'react-modal';

import {State} from '../../reducers';
import {deleteBidderAction, requestAgencyBiddersAction} from '../../reducers/biddersList';
import {openConfirmYesNo} from '../../reducers/confirm';

import {Bidder} from '../../models/auction/Bidder';
import {BiddersList} from '../../components/BiddersList';
import {Button} from '../../components/Button';
import {AgencyBidderCreateView} from './AgencyBidderCreateView';

interface AgencyBiddersViewProps extends ClassAttributes<AgencyBiddersViewComponent> {
    children?: any;
    agencyId: number;
}

interface StateProps {
    loading: boolean;
    bidders: Bidder[];
}

interface DispatchProps {
    requestBidders: () => any;
    deleteBidder: (id: number) => any;
    confirmDeleteBidder: (onOk: () => any) => any;
}

export class AgencyBiddersViewComponent extends Component<StateProps & DispatchProps & AgencyBiddersViewProps, {
    createModal?: boolean;
}> {
    state = {
        createModal: false
    };

    deleteBidder = (id: number) => {
        this.props.confirmDeleteBidder(() => this.props.deleteBidder(id));
    }

    componentDidMount() {
        this.props.requestBidders();
    }

    componentWillReceiveProps(next: AgencyBiddersViewProps) {
        // if route changed from child to current
        if (this.props.children && !next.children) {
            this.props.requestBidders();
        }
    }

    render() {
        const {bidders, loading} = this.props;
        return <div>
            <div className='toolbar'>
                <div className='title'>Bidders</div>
                <div className='flex-space'/>
                <Button className='primary' iconLeft='fa fa-plus-circle' onClick={this.openCreateModal}>Create
                    bidder</Button>
            </div>
            <BiddersList
                loading={loading}
                bidders={bidders}
                deleteBidder={this.deleteBidder}/>
            <Modal
                className='ReactModal__Content'
                overlayClassName='ReactModal__Overlay'
                contentLabel=''
                closeTimeoutMS={300}
                isOpen={this.state.createModal}
                onRequestClose={this.closeCreateModal}>
                <h1>New Bidder</h1>
                <AgencyBidderCreateView onCancel={this.closeCreateModal}/>
            </Modal>
        </div>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => {
        this.props.requestBidders();
        this.setState({createModal: false} as any);
    }
}

export const AgencyBiddersView = connect<StateProps, DispatchProps, AgencyBiddersViewProps>(
    (state: State) => {
        return {
            loading: state.biddersList.loading,
            bidders: Array.from(state.biddersList.map.values())
        };
    },
    (dispatch: Dispatch<any>, ownProps) => {
        return {
            requestBidders: () => dispatch(requestAgencyBiddersAction(ownProps.agencyId)),
            deleteBidder: (id: number) => dispatch(deleteBidderAction(id)),
            confirmDeleteBidder: (onOk: () => any) => dispatch(openConfirmYesNo('Delete Bidder?', onOk))
        };
    }
)(AgencyBiddersViewComponent);
