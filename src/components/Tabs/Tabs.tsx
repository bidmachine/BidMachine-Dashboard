import './Tabs.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

export interface Tab {
    title: JSX.Element | string;
    component?: JSX.Element | string;
}

interface TabsProps extends ClassAttributes<Tabs> {
    selected?: number;
    onSelect?: (index: number) => any;
    tabs?: Tab[];
}

export class Tabs extends Component<TabsProps, {}> {
    static defaultProps = {
        tabs: []
    };

    render() {
        const {selected, tabs} = this.props;
        const selectedTab = tabs[selected];
        return <div className='tabs'>
            <div className='tabs-row'>
                {tabs.map((tab, i) => {
                    const className = 'tab' + (selected === i ? ' selected' : '');
                    return <div key={i} className={className} onClick={() => this.select(i)}>
                        {tab.title}
                    </div>;
                })}
            </div>
            <div className='tabs-content'>
                {selectedTab && selectedTab.component}
            </div>
        </div>;
    }

    private select = (i: number) => {
        const {onSelect} = this.props;
        if (onSelect) { onSelect(i); }
    }
}
