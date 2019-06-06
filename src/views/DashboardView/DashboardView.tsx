import './DashboardView.scss';
import * as moment from 'moment';
import {Moment} from 'moment';
import * as React from 'react';
import {ClassAttributes} from 'react';
import {connect, Dispatch} from 'react-redux';
import {State} from '../../reducers';
import {browserHistory} from 'react-router';

import {PerformanceView} from './PerformanceView/PerformanceView';
import {DateRange, PerformanceTab, setDateRangeAction, setPerformanceTabAction} from '../../reducers/statistics';
import {Collection} from '../../models/statistics/Collection';

import {AppView} from '../../components/AppView';
import {Button} from '../../components/Button';
import {DateRangePicker, FocusedInputShape} from 'react-dates';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';

const DateRangePickerExtended = DateRangePicker as any;

interface DashboardViewProps extends ClassAttributes<DashboardViewComponent> {
    location?: any;
    startDate?: Moment;
    endDate?: Moment;
}

interface StateProps extends DateRange {
    performanceTab: PerformanceTab;
}

interface DispatchProps {
    setDateRange: (range: DateRange) => any;
    setPerformanceTab: (tab: PerformanceTab) => any;
}

const tabs: Collection[] = [
    'daily',
    'country',
    'adType',
    'platform',
    'seller',
    'agency'
//  'app'
];

const Dateformat = 'YYYY-MM-DD';

function query(tab: string, startDate: string, endDate: string): string {
    let url = new URLSearchParams();
    url.append('tab', tab);
    url.append('startDate', startDate);
    url.append('endDate', endDate);
    return '?' + url.toString()
}

enum ValidIntervals {
    today,
    yesterday,
    days7,
    days30,
    lastmonth,
    month,
    days60,
    days90,
    custom
}

const timeouts = [{
    value: 0,
    label: 'no refresh timeout'
}, {
    value: 1000,
    label: 'refresh every 1 sec'
}, {
    value: 5000,
    label: 'refresh every 5 sec'
}, {
    value: 10000,
    label: 'refresh every 10 sec'
}, {
    value: 30000,
    label: 'refresh every 30 sec'
}];

export class DashboardViewComponent extends React.Component<DashboardViewProps & StateProps & DispatchProps, {
    focusedInput?: FocusedInputShape;
    timeout?: any;
    range?: DateRange
}> {
    state = {
        focusedInput: null,
        timeout: timeouts[0],
        range: {
            startDate: moment().utc(),
            endDate: moment().utc()
        }
    };

    componentDidMount() {
        const {tab, startDate, endDate} = this.props.location.query;
        if (!tab || !startDate || !endDate) {
            this.redirect();
        }
        if (tab) {
            this.props.setPerformanceTab(tabs.indexOf(tab));
        }
        if (startDate && endDate) {
            this.setState({
                range: {
                    startDate: moment.utc(startDate),
                    endDate: moment.utc(endDate),
                }
            });
            this.props.setDateRange({
                startDate: moment.utc(startDate),
                endDate: moment.utc(endDate),
            });
        }
    }

    componentWillUpdate(next: DashboardViewProps, nextState: {
        focusedInput?: FocusedInputShape;
        timeout?: any;
    }) {
        const {tab, startDate, endDate} = next.location.query;

        if (!tab || !startDate || !endDate) {
            this.redirect();
            return;
        }
        if (tab !== this.props.location.query.tab) {
            this.props.setPerformanceTab(tabs.indexOf(tab));
        }
    }

    render() {
        const {performanceTab} = this.props;
        return <AppView className='dashboard-view'>
            <div className='toolbar'>
                <div className='toolbar-block'>
                    <div className="toolbar-item">
                        <div className='title'>Dashboard</div>
                    </div>
                </div>
                <div className='toolbar-block'>
                    <div className="toolbar-item">
                        <DateRangePickerExtended
                            showDefaultInputIcon
                            displayFormat='DD/MM/YYYY'
                            minimumNights={0}
                            isOutsideRange={() => false}
                            startDate={this.props.startDate} // momentPropTypes.momentObj or null,
                            endDate={this.props.endDate} // momentPropTypes.momentObj or null,
                            onDatesChange={this.setLocalDateRange} // PropTypes.func.isRequired,
                            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            onFocusChange={(focusedInput) => this.setState({focusedInput} as any)} // PropTypes.func.isRequired,
                            renderCalendarInfo={this.renderCalendarInfo}
                        />
                    </div>
                </div>
            </div>
            <Tabs
                selectedIndex={performanceTab}
                onSelect={this.setPerformanceTab}
            >
                <TabList className="tabList">
                    <Tab className='step-second'>Daily performance</Tab>
                    <Tab>Performance by Country</Tab>
                    <Tab>Performance by AdType</Tab>
                    <Tab>Performance by Platform</Tab>
                    <Tab>Performance by SSP</Tab>
                    <Tab>Performance by Agency</Tab>

                </TabList>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
            </Tabs>
            <PerformanceView collection={tabs[performanceTab]} timeout={this.state.timeout.value}/>
        </AppView>;
    }

    private setPerformanceTab = (tab: number) => {
        this.redirect(tabs[tab]);
    };

    private setDateRange = (range: DateRange) => {
        if (range.startDate && range.endDate) {
            this.redirect(
                tabs[this.props.performanceTab],
                range.startDate.format(Dateformat),
                range.endDate.format(Dateformat),
            );
        }
        this.props.setDateRange(range);
    };

    private setLocalDateRange = (range: DateRange) => {
        const stateUpdate: any = {};
        if (range.startDate) {
            stateUpdate.startDate = range.startDate;
        }
        if (range.endDate) {
            stateUpdate.endDate = range.endDate;
        }
        if (Object.keys(stateUpdate).length) {
            this.setState({range: stateUpdate});
            this.setDateRange(stateUpdate);
        }
    };

    private setToday = () => {
        this.setDateRange({
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private setYesterday = () => {
        this.setDateRange({
            startDate: moment().subtract(1, 'day').startOf('day'),
            endDate: moment().subtract(1, 'day').endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    // private setTimeout = (timeout) => this.setState({ timeout });
    private set7days = () => {
        this.setDateRange({
            startDate: moment().subtract(7 - 1, 'day').startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private set30days = () => {
        this.setDateRange({
            startDate: moment().subtract(30 - 1, 'day').startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private setThisMonth = () => {
        this.setDateRange({
            startDate: moment().startOf('month').startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private setLastMonth = () => {
        this.setDateRange({
            startDate: moment().subtract(1, 'month').startOf('month').startOf('day'),
            endDate: moment().subtract(1, 'month').endOf('month').endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private set60days = () => {
        this.setDateRange({
            startDate: moment().subtract(60 - 1, 'day').startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private set90days = () => {
        this.setDateRange({
            startDate: moment().subtract(90 - 1, 'day').startOf('day'),
            endDate: moment().endOf('day')
        });
        this.setState({focusedInput: null} as any);
    };

    private renderCalendarInfo = () => {
        const {startDate, endDate} = this.props;
        const selected: ValidIntervals = (() => {
            if (startDate && endDate) {
                const start = startDate.format('YYYY-MM-DD');
                const end = endDate.format('YYYY-MM-DD');
                if (start === moment().format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.today;
                } else if (start === moment().subtract(1, 'day').format('YYYY-MM-DD') && end === moment().subtract(1, 'day').format('YYYY-MM-DD')) {
                    return ValidIntervals.yesterday;
                } else if (start === moment().subtract(7 - 1, 'day').format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.days7;
                } else if (start === moment().subtract(30 - 1, 'day').format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.days30;
                } else if (start === moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') && end === moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')) {
                    return ValidIntervals.lastmonth;
                } else if (start === moment().startOf('month').format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.month;
                } else if (start === moment().subtract(60 - 1, 'day').format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.days60;
                } else if (start === moment().subtract(90 - 1, 'day').format('YYYY-MM-DD') && end === moment().format('YYYY-MM-DD')) {
                    return ValidIntervals.days90;
                } else {
                    return ValidIntervals.custom;
                }
            } else {
                return ValidIntervals.custom;
            }
        })() as ValidIntervals;

        return <div className='date-picker-info'>
            <Button onClick={this.setToday}
                    className={`small${selected === ValidIntervals.today ? ' primary' : ''}`}>Today</Button>
            <Button onClick={this.setYesterday}
                    className={`small${selected === ValidIntervals.yesterday ? ' primary' : ''}`}>Yesterday</Button>
            <Button onClick={this.set7days} className={`small${selected === ValidIntervals.days7 ? ' primary' : ''}`}>Last
                7
                days</Button>
            <Button onClick={this.set30days} className={`small${selected === ValidIntervals.days30 ? ' primary' : ''}`}>Last
                30 days</Button>
            <Button onClick={this.setLastMonth}
                    className={`small${selected === ValidIntervals.lastmonth ? ' primary' : ''}`}>Last
                month</Button>
            <Button onClick={this.setThisMonth}
                    className={`small${selected === ValidIntervals.month ? ' primary' : ''}`}>This
                month</Button>
            <Button onClick={this.set60days} className={`small${selected === ValidIntervals.days60 ? ' primary' : ''}`}>Last
                60 days</Button>
            <Button onClick={this.set90days} className={`small${selected === ValidIntervals.days90 ? ' primary' : ''}`}>Last
                90 days</Button>
        </div>;
    };

    private redirect(tab = tabs[this.props.performanceTab],
                     startDate = this.props.startDate.format(Dateformat),
                     endDate = this.props.endDate.format(Dateformat)) {
        const {pathname} = this.props.location;
        browserHistory.push(pathname + query(tab || 'daily', startDate, endDate));
    }
}

export const DashboardView = connect<StateProps, DispatchProps, DashboardViewProps>(
    (state: State) => {
        return {
            adNetworks: state.statistics.adNetworks,
            startDate: state.statistics.startDate,
            endDate: state.statistics.endDate,
            performanceTab: state.statistics.performanceTab
        } as any;
    },
    (dispatch: Dispatch<any>) => {
        return {
            setDateRange: (range: DateRange) => dispatch(setDateRangeAction(range.startDate, range.endDate)),
            setPerformanceTab: (tab: PerformanceTab) => dispatch(setPerformanceTabAction(tab)),
        };
    },
)(DashboardViewComponent);
