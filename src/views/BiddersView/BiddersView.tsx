// import './BiddersView.scss';
import * as React from 'react';
import {ClassAttributes} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import * as Modal from 'react-modal';

import {State} from '../../reducers';
import {deleteBidderAction, requestBiddersAction} from '../../reducers/biddersList';
import {openConfirmYesNo} from '../../reducers/confirm';

import {Bidder} from '../../models/auction/Bidder';
import {AppView} from '../../components/AppView';
import Button from '../../components/Button';
import {BiddersList} from '../../components/BiddersList';
import {BidderCreateView} from '../BidderCreateView/BidderCreateView';

interface BiddersViewProps extends ClassAttributes<BiddersViewComponent> {
    children?: any;
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

export class BiddersViewComponent extends React.Component<StateProps & DispatchProps & BiddersViewProps, {
    createModal: boolean;
}> {
    state = {
        createModal: false
    }

    deleteBidder = (id: number) => {
        this.props.confirmDeleteBidder(() => this.props.deleteBidder(id));
    };

    componentDidMount() {
        this.props.requestBidders();
    }

    componentWillReceiveProps(next: BiddersViewProps) {
        // if route changed from child to current
        if (this.props.children && !next.children) {
            this.props.requestBidders();
        }
    }

    render() {
        const {bidders, loading} = this.props;
        return <AppView childrenContext={this.props.children}>
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
                <BidderCreateView onCancel={this.closeCreateModal}/>
            </Modal>
        </AppView>;
    }

    private openCreateModal = () => this.setState({createModal: true} as any);

    private closeCreateModal = () => {
        this.props.requestBidders();
        this.setState({createModal: false} as any);
    };
}

export const BiddersView = connect<StateProps, DispatchProps, BiddersViewProps>(
    (state: State) => {
        return {
            loading: state.biddersList.loading,
            bidders: Array.from(state.biddersList.map.values())
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestBidders: () => dispatch(requestBiddersAction()),
            deleteBidder: (id: number) => dispatch(deleteBidderAction(id)),
            confirmDeleteBidder: (onOk: () => any) => dispatch(openConfirmYesNo('Delete Bidder?', onOk))
        };
    }
)(BiddersViewComponent);
