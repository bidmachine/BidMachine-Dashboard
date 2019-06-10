import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Confirm} from "../../components/Confirm/Confirm";

import {State} from '../../reducers';
import {requestSellerAction, updateSSPAction} from '../../reducers/SSPList';

import {SSP} from '../../models/auction/SSP';
import {AppView} from '../../components/AppView';
import {Progress} from '../../components/Progress';
import {SSPFormEdit} from '../../forms/SSPForm';

interface SSPViewProps extends ClassAttributes<SellerViewComponent> {
    params: any;
}

interface SSPViewStateProps {
    loading: boolean;
    seller: SSP;
}

interface SSPViewDispatchProps {
    requestSSP: (id: number) => any;
    updateSSP: (id: number, seller: SSP) => any;
}

export class SellerViewComponent extends Component<SSPViewProps & SSPViewStateProps & SSPViewDispatchProps, {}> {
    componentDidMount() {
        this.loadSeller(this.props.params.id);
    }

    componentWillReceiveProps(next: SSPViewProps) {
        if (this.props.params.id !== next.params.id) {
            this.loadSeller(next.params.id);
        }
    }

    render() {
        const {seller, loading} = this.props;
        if (seller) {
            return <AppView childrenContext={this.props.children}>
                {
                    loading
                        ? <Progress/>
                        : <div>
                            <h1>SSP</h1>
                            <SSPFormEdit onSubmit={this.updateSSP}/>
                        </div>
                }
                <Confirm/>
            </AppView>;
        } else {
            return null;
        }
    }

    private updateSSP = (seller: SSP) => {
        this.props.updateSSP(this.props.params.id, seller);
    }

    private loadSeller(id) {
        this.props.requestSSP(id);
    }
}

export const SellerView = connect<SSPViewStateProps, SSPViewDispatchProps, SSPViewProps>(
    (state: State) => {
        return {
            loading: state.SSPList.loadingSelected,
            seller: state.SSPList.selected
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestSSP: (id: number) => dispatch(requestSellerAction(id)),
            updateSSP: (id: number, seller: SSP) => dispatch(updateSSPAction(id, seller))
        };
    }
)(SellerViewComponent);
