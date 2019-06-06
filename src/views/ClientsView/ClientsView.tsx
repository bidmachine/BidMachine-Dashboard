import * as React from 'react';
import {Component} from 'react';

import {AppView} from '../../components/AppView';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {browserHistory} from 'react-router';

import {ClientsTypeView} from '../ClientsTypeView/ClientsTypeView';

import {connect, Dispatch} from 'react-redux';
import {State} from '../../reducers';
import {setTab} from '../../reducers/SSPList';

const tabs = new Map<any, any>([
    ['agency', 0],
    ['ssp', 1],
    [0, 'agency'],
    [1, 'ssp']
]);

function query(tab: string): string {
    return '?tab=' + tab;
}

interface StateProps {
    tab?: string;
    location?: any;
}

interface DispatchProps {
    setTab: (tab: string) => any;
}

export class ClientsViewComponent extends Component<StateProps & DispatchProps, {}> {

    componentDidMount() {
        const {tab} = this.props.location.query;
        if (!tab) {
            this.redirect();
        }
        if (tab) {
            this.props.setTab(tab);
        }
    }

    componentWillReceiveProps(next: StateProps & DispatchProps) {
        const {tab} = next.location.query;
        if (!tab) {
            this.redirect();
            return;
        }
        if (tab !== this.props.location.query.tab) {
            this.props.setTab(tab);
        }
    }

    render() {
        return <AppView>
            <div className='toolbar'>
                <div className='title'>Clients</div>
                <div className='flex-space'/>
            </div>
            <Tabs
                onSelect={(tab) => this.props.setTab(tabs.get(tab))}
                selectedIndex={tabs.get(this.props.tab)}>
                <TabList>
                    <Tab>Agencies</Tab>
                    <Tab>SSP</Tab>
                </TabList>
                <TabPanel/>
                <TabPanel/>
            </Tabs>
            <ClientsTypeView type={this.props.tab}/>
        </AppView>;
    }

    private redirect(tab = this.props.tab) {
        const {pathname} = this.props.location;
        browserHistory.push(pathname + query(tab || 'agency'));
    }
}

export const ClientsView = connect<StateProps, DispatchProps, {}>(
    (state: State) => {
        return {
            tab: state.SSPList.tab
        } as any;
    },
    (dispatch: Dispatch<any>) => {
        return {
            setTab: (tab: string) => dispatch(setTab(tab)),
        };
    },
)(ClientsViewComponent);
