import * as React from 'react';
import {Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import {createSSPAction} from '../../reducers/SSPList';
import {SSP} from '../../models/auction/SSP';

import {AppView} from '../../components/AppView';
import {SSPForm} from '../../forms/SSPForm';

interface DispatchProps {
    createSeller: (seller: SSP) => any;
}

interface CreateSSPProps {
    onCancel: () => any;
}

export class CreateSSPViewComponent extends Component<DispatchProps & CreateSSPProps, {}> {
    render() {
        return <AppView>
            <div className='toolbar'>
                <div className='title'>New SSP</div>
                <div className='flex-space'/>
            </div>
            <SSPForm onSubmit={this.createSeller} onCancel={this.props.onCancel}/>
        </AppView>;
    }

    private createSeller = async (seller: SSP) => {
        const create = await this.props.createSeller(seller);
        if (create.seller) {
            this.props.onCancel();
        }
    }
}

export const CreateSSP = connect<{}, DispatchProps, CreateSSPProps>(
    null,
    (dispatch: Dispatch<any>) => {
        return {
            createSeller: (seller: SSP) => dispatch(createSSPAction(seller)),
        };
    }
)(CreateSSPViewComponent);
