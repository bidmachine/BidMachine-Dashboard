// import './AdSpacesView.scss';
import * as React from 'react';
import {Component} from 'react';
import * as Select from 'react-select';

import {requestSSPAction} from '../../reducers/SSPSelect';
import {AppView} from '../../components/AppView';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {DetailedAdSpacesView} from './DetailedAdSpacesView/DetailedAdSpacesView';
import {SSP} from '../../models/auction/SSP';
import {Dispatch} from 'redux';
import {State} from '../../reducers';
import {connect} from 'react-redux';

interface StateProps {
    loading: boolean;
    sellers: SSP[];
}

interface DispatchProps {
    loadSSP: () => any;
}

export class AdSpacesViewCompoment extends Component<StateProps & DispatchProps, {
    adSpaceTab: number;
    sellerId: number;
}> {
    state = {
        adSpaceTab: 0,
        sellerId: 1
    };

    componentDidMount() {
        this.props.loadSSP();
    }

    selectTab = adSpaceTab => this.setState({adSpaceTab} as any);

    selectSeller = sellerId => this.setState({sellerId} as any);

    render() {
        const {sellerId} = this.state;
        const {sellers, loading} = this.props;
        return <AppView childrenContext={this.props.children}>
            <div className='toolbar'>
                <div className='title'>Ad Spaces</div>
                <div className='flex-space'/>
            </div>
            <div>
                <div className='form-field' style={{paddingTop: '5px', paddingBottom: '20px'}}>
                    <label>
                        Seller Id
                    </label>
                    <div>
                        <Select
                            style={{minWidth: '320px'}}
                            isLoading={loading}
                            searchable={false}
                            clearable={false}
                            simpleValue
                            value={sellerId}
                            options={sellers.map(seller => ({
                                value: seller.id,
                                label: seller.name
                            }))}
                            onChange={this.selectSeller}
                        />
                    </div>
                </div>
            </div>
            <Tabs
                onSelect={this.selectTab}
                selectedIndex={this.state.adSpaceTab}>
                <TabList>
                    <Tab>Banner</Tab>
                    <Tab>Native</Tab>
                    <Tab>Video</Tab>
                </TabList>
                <TabPanel>
                    <DetailedAdSpacesView type='banner' sellerId={sellerId}/>
                </TabPanel>
                <TabPanel>
                    <DetailedAdSpacesView type='native' sellerId={sellerId}/>
                </TabPanel>
                <TabPanel>
                    <DetailedAdSpacesView type='video' sellerId={sellerId}/>
                </TabPanel>
            </Tabs>
        </AppView>;
    }
}

export const AdSpacesView = connect<StateProps, DispatchProps, {}>(
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
)(AdSpacesViewCompoment);
