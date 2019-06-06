import * as React from 'react';
import {browserHistory, Redirect, Router} from "react-router";
import {Route} from "../lib/route";
import UserLayout from "../layouts/UserLayout";
import {DashboardView} from "../views/DashboardView/DashboardView";
import {BiddersView} from "../views/BiddersView/BiddersView";
import {BidderView} from "../views/BidderView/BidderView";
import {AgencyView} from "../views/AgencyView/AgencyView";
import {AdSpacesView} from "../views/AdSpacesView/AdSpacesView";
import {AdProfilesView} from "../views/AdProfilesView/AdProfilesView";
import {ClientsView} from '../views/ClientsView/ClientsView';
import {SellerView} from '../views/SellerView/SellerView';

export default class UserRouter extends React.Component<{}, {}> {
    render() {
        return (
            <Router history={browserHistory}>
                <Redirect from='/' to='/dashboard' query={{}}/>
                <Route name='Home' component={UserLayout} path="/">
                    <Route path='/dashboard' component={DashboardView} name='Dashboard'/>
                    <Route path='/bidders' component={BiddersView} name='Bidders'>
                        <Route path=':id' component={BidderView} name='Bidder'/>
                    </Route>
                    <Route path='/clients' component={ClientsView} name='Clients'/>
                    <Route path='/agencies/:id' component={AgencyView} name='Agency'/>
                    <Route path='/ssp/:id' component={SellerView} name='SSP'/>
                    <Route path='/adprofiles' component={AdProfilesView} name='Ad Profiles'/>
                    <Route path='/adspaces' component={AdSpacesView} name='Ad Spaces'/>
                </Route>
                <Redirect from='*' to='/dashboard' query={{}}/>
            </Router>
        );
    }
}
