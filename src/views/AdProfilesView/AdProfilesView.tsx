// import './AdProfilesView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

import {AdProfilesTypeView} from '../AdProfilesTypeView/AdProfilesTypeView';
import {AppView} from '../../components/AppView';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {AdProfileType} from '../../models/auction';

const tabs: AdProfileType[] = ['banner', 'native', 'video'];

interface AdProfilesViewProps extends ClassAttributes<AdProfilesView> {
}

export class AdProfilesView extends Component<AdProfilesViewProps, {
    tab: number;
}> {
    state = {
        tab: 0
    };
    selectTab = tab => this.setState({tab} as any);

    render() {
        return <AppView>
            <div className='toolbar'>
                <div className='title'>Ad Profiles</div>
                <div className='flex-space'/>
            </div>
            <Tabs
                onSelect={this.selectTab}
                selectedIndex={this.state.tab}>
                <TabList>
                    <Tab>Banner</Tab>
                    <Tab>Native</Tab>
                    <Tab>Video</Tab>
                </TabList>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
            </Tabs>
            <AdProfilesTypeView type={tabs[this.state.tab]}/>
        </AppView>;
    }
}
