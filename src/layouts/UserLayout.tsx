import './UserLayout.scss';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {Confirm} from "../components/Confirm/Confirm";
import {LOGO} from "../lib/consts";
import {Header} from "../components/Header";
import {Sidebar, SidebarItem} from "../components/Sidebar";
import {RouteConfig} from "react-router";
import Breadcrumbs = require("react-breadcrumbs");

class UserLayout extends React.Component<{
    location: Location;
    routes: RouteConfig;
    params: any;
}, {}> {
    render() {
        return (
            <div className='app'>
                <Confirm/>
                <Header>
                    <div className='logo'><img src={LOGO}/></div>
                    <h1 className='step-first'>BidMachine</h1>
                    <div className='flex-space'/>
                </Header>
                <main>
                    <Sidebar>
                        <SidebarItem
                            icon='fa ion-ios-speedometer'
                            label='Dashboard'
                            active={this.isActive('/dashboard')}
                            link='/dashboard'/>
                        <SidebarItem
                            icon='fa fa-gavel'
                            label='Bidders'
                            active={this.isActive('/bidders')}
                            link='/bidders'/>
                        <SidebarItem
                            icon='fa fa-briefcase'
                            label='Clients'
                            active={this.isActive('/clients') || this.isActive('/agencies') || this.isActive('/ssp')}
                            link='/clients'/>
                        <SidebarItem
                            icon='fa fa-bars'
                            label='Ad Profiles'
                            active={this.isActive('/adprofiles')}
                            link='/adprofiles'/>
                        <SidebarItem
                            icon='fa fa-mobile'
                            label='Ad Spaces'
                            iconStyle={{fontSize: 38}}
                            active={this.isActive('/adspaces')}
                            link='/adspaces'/>
                    </Sidebar>
                    <div className='content'>
                        <Breadcrumbs routes={this.props.routes} params={this.props.params}/>
                        {this.props.children}
                    </div>
                </main>
            </div>
        )
    }

    private isActive(route: string) {
        const pathname = this.props.location.pathname as any as string;
        return pathname.indexOf(route) === 0;
    }
}

export default connect(() => ({}), (dispatch: Dispatch<any>) => ({}))(UserLayout)
