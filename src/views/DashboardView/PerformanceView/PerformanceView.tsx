// import './PerformanceView.scss';
import * as React from 'react';
import {ClassAttributes} from 'react';
import {connect, Dispatch} from 'react-redux';
import * as moment from 'moment';
import {Moment} from 'moment';

import {State} from '../../../reducers';
import {clearTimerAction, setTimerAction} from '../../../reducers/refresh';
import {Dimension, getDimensions} from '../../../lib/api';
import {clearPerformanceAction, requestPerformanceAction} from '../../../reducers/statistics';
import {Collection} from '../../../models/statistics/Collection';
import {Performance} from '../../../models/statistics/Performance';
import {Granularity} from '../../../models/statistics/Granularity';

import {AppView} from '../../../components/AppView';
import {Button} from '../../../components/Button';
import {Column, DataTableSorted} from '../../../components/DataTable';
import {DailyChart} from '../DailyChart/DailyChart';
import Select from 'react-select';
import {abbreviate, numberWithCommas} from "../../../lib/format";
import {Progress} from '../../../components/Progress';

import {Icon} from 'react-icons-kit';
import {areaChart} from 'react-icons-kit/fa/areaChart';
import {lineChart} from 'react-icons-kit/fa/lineChart';
import {barChart} from 'react-icons-kit/fa/barChart';

function splitDimensions(value: string) {
    if (value === '') {
        return [];
    } else {
        return value.split(',');
    }
}

interface PerformanceViewProps extends ClassAttributes<PerformanceViewComponent> {
    collection?: Collection;
    chartView?: any;
    timeout?: number;
}

interface StateProps {
    startDate: Moment;
    endDate: Moment;
    granularity: Granularity;
    loading: boolean;
    performance: Performance[];
    timer: any;
}

interface DispatchProps {
    requestPerformance: (startDate: Moment, endDate: Moment, collection?: Collection, dimensions?: any[]) => any;
    clearPerormance: () => any;
    setTimer: (timer: any) => any;
    clearTimer: () => any;
}

export class PerformanceViewComponent extends React.Component<PerformanceViewProps & StateProps & DispatchProps, {
    dimensions?: Dimension[];
    selectedDimensions?: string;
    loadingDimensions?: boolean;
    shorten: boolean;
    graphic: string;
}> {
    state = {
        dimensions: [] as Dimension[],
        shorten: false,
        selectedDimensions: '',
        loadingDimensions: false,
        graphic: 'line'
    };

    componentDidMount() {
        if (this.props.timeout) {
            this.setTimer(this.props.timeout);
        }
        if (this.props.collection !== 'daily' || !this.props.collection) {
            this.loadDimensions(this.props.collection, this.props.startDate, this.props.endDate)
                .then(() => {
                    this.requestPerformance(
                        this.props.startDate,
                        this.props.endDate,
                        this.props.collection,
                        splitDimensions(this.state.selectedDimensions)
                    );
                });
        } else {
            this.requestPerformance(this.props.startDate, this.props.endDate, this.props.collection);
        }
    }

    componentWillReceiveProps(next: StateProps & PerformanceViewProps) {
        if (this.state.graphic === 'bar' && (next.collection === 'daily' || next.collection === 'country')) {
            this.setState({graphic: 'line'} as any);
        }
        if (next.collection !== 'daily' && next.collection !== this.props.collection) {
            this.loadDimensions(next.collection, next.startDate, next.endDate)
                .then(() => {
                    const selectedDimensions = splitDimensions(this.state.selectedDimensions);
                    const {dimensions} = this.state;
                    selectedDimensions.forEach(dim => {
                        if (!dimensions.find(d => d.value === dim)) {
                            selectedDimensions.splice(selectedDimensions.indexOf(dim));
                        }
                    });
                    this.setState({
                        selectedDimensions: selectedDimensions.join(',')
                    });
                    if (selectedDimensions.length) {
                        this.requestPerformance(
                            this.props.startDate,
                            this.props.endDate,
                            this.props.collection,
                            selectedDimensions
                        );
                    }
                });
        } else if (next.startDate !== this.props.startDate || next.endDate !== this.props.endDate || next.collection !== this.props.collection) {
            if (this.props.collection) {
                this.requestPerformance(
                    next.startDate,
                    next.endDate,
                    next.collection,
                    splitDimensions(this.state.selectedDimensions)
                );
            } else {
                this.requestPerformance(next.startDate, next.endDate, next.collection);
            }
        }
        if (next.timeout !== this.props.timeout) {
            this.setTimer(next.timeout);
        }
    }

    renderChart() {
        const {performance, collection, loading} = this.props;
        const {graphic, loadingDimensions} = this.state;
        return (<div>
                {performance[0] && !loadingDimensions && !loading && (collection !== 'daily' ? splitDimensions(this.state.selectedDimensions).length : true) ?
                    <DailyChart graphic={graphic} collection={collection}
                                dimensions={splitDimensions(this.state.selectedDimensions)}
                                data={performance.map(stat => ({
                                        name: moment(stat.timestamp).utc().format(this.props.granularity === 'day' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:00'),
                                        impressions: stat.impressions,
                                        spent: stat.spent,
                                        bids: stat.bids,
                                        wins: stat.wins,
                                        clicks: stat.clicks,
                                        ecpm: stat.ecpm,
                                        errors: stat.errors,
                                        errorRate: stat.errorsRate,
                                        displayRate: stat.displayRate,
                                        ctr: stat.ctr,
                                        finishes: stat.finishes,
                                        sspIncome: stat.sspIncome,
                                        exchangeFee: stat.exchangeFee,
                                        agency: stat.agency,
                                        adType: stat.adType,
                                        platform: stat.platform,
                                        country: stat.country,
                                        seller: stat.seller,
                                        lostImpressions: stat.lostImpressions,
                                        lostImpressionsRevenue: stat.lostImpressionsRevenue
                                    })
                                )}/> : null}
                {loading ? (collection === 'daily' ? (<Progress/>) : (!loadingDimensions && loading &&
                    <Progress/>)) : null}
                {!performance[0] && !loading && !loadingDimensions &&
                <div style={{textAlign: 'center'}}>Error: No data for selected filteres</div>}
            </div>
        );
    }

    render() {
        const {collection, performance, loading} = this.props;
        const {dimensions, selectedDimensions, loadingDimensions, graphic} = this.state;
        return <AppView padding={false}>
            {
                collection !== 'daily' ? <div className='toolbar'>
                    <Select
                        wrapperStyle={{flex: 1, marginRight: 4}}
                        multi
                        simpleValue
                        value={selectedDimensions}
                        isLoading={loadingDimensions}
                        options={dimensions.sort((firstValue, secondValue) => {
                            if (firstValue.label > secondValue.label) { return 1; }
                            if (firstValue.label < secondValue.label) { return -1; }
                            return 0;
                        })}
                        onChange={this.selectDimensions}/>
                    <Button className='primary' iconLeft='fa fa-check-circle'
                            onClick={this.requestPerformanceForCollection}>Apply</Button>
                    {performance[0] && !loading && !loadingDimensions && (collection.toString() !== 'daily' ? splitDimensions(this.state.selectedDimensions).length : true) ?
                        <div>
                            <Button
                                className={graphic === 'line' ? 'primary' : ''}
                                style={{marginRight: '5px', marginLeft: '5px', padding: '3px 3px 0 3px'}}
                                onClick={this.setLineGraphic}
                            >
                                <Icon size={24} icon={lineChart}/>
                            </Button>
                            <Button className={graphic === 'bar' ? 'primary' : ''}
                                    style={{padding: '3px 3px 0 3px', marginRight: '5px'}} onClick={this.setBarGraphic}>
                                <Icon size={24} icon={barChart}/>
                            </Button>
                            <span className='step-sixth'>
              <Button className={graphic === 'area' ? 'primary' : ''} style={{padding: '3px 3px 0 3px'}}
                      onClick={this.setAreaGraphic}>
                <Icon size={24} icon={areaChart}/>
              </Button>
            </span>
                        </div> : null}
                </div> : <div>
                    {performance[0] && (collection !== 'daily' ? splitDimensions(this.state.selectedDimensions).length : true) ?
                        <div className='graphic-toolbar'>
                            <div className='flex-space'/>
                            <div className='graphic-content'>
                                <Button
                                    className={graphic === 'line' ? 'primary' : ''}
                                    style={{marginRight: '5px', marginLeft: '5px', padding: '3px 3px 0 3px'}}
                                    onClick={this.setLineGraphic}
                                >
                                    <Icon size={24} icon={lineChart}/>
                                </Button>
                                <span className='step-sixth'>
                <Button className={graphic === 'area' ? 'primary' : ''} style={{padding: '3px 3px 0 3px'}}
                        onClick={this.setAreaGraphic}>
                  <Icon size={24} icon={areaChart}/>
                </Button>
              </span>
                            </div>
                        </div> : null}
                </div>
            }
            <div>
                {this.renderChart()}
                {performance[0] && !loading && !loadingDimensions && (collection !== 'daily' ? splitDimensions(this.state.selectedDimensions).length : true) ?
                    <DataTableSorted
                        buttons={[
                            <Button key="shorten" onClick={() => {
                                this.setState({...this.state, shorten: !this.state.shorten});
                            }}
                                    className={`small ${this.state.shorten ? 'primary' : ''}`}
                                    iconLeft='fa fa-columns'>Shorten</Button>,
                        ]}
                        sortColumn='timestamp'
                        sortDirection={1}
                        total
                        customize
                        customizeStore='performance'
                        columns={this.columns(this.props)}
                        data={performance}/> : null}
            </div>
        </AppView>;
    }

    private displayValue(value: number) {
        return this.state.shorten ? abbreviate(value, 2, false, false) : numberWithCommas(value);
    }

    private columns: ((props: any) => Column[]) = (props) => [{
        value: 'timestamp',
        label: 'Time (UTC)',
        total: 'Total',
        render: (item: Performance) => {
            const format = this.props.granularity === 'day' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:00';
            return moment(item.timestamp).utc().format(format);
        }
    }, this.secondColumn(props), {
        value: 'bids',
        label: 'Bids',
        total: total => this.displayValue(total),
        render: item => this.displayValue(item.bids || 0)
    }, {
        value: 'wins',
        label: 'Wins',
        total: total => this.displayValue(total),
        render: item => this.displayValue(item.wins || 0)
    }, {
        value: 'errors',
        label: 'Errors',
        total: total => this.displayValue(total),
        render: item => this.displayValue(item.errors || 0)
    }, {
        value: 'errorsRate',
        label: 'Error rate %',
        render: (item: Performance) => {
            return item.errorsRate + '%';
        },
        total: (e, data) => {
            const totalWins = data.reduce((s, row) => s + row.wins, 0);
            const totalErrors = data.reduce((s, row) => s + row.errors, 0);
            if (totalErrors && totalWins) {
                return numberWithCommas((100 * totalErrors / totalWins).toFixed(2).toLocaleString()) + '%';
            } else {
                return 0;
            }
        },
    },
        {
            value: 'impressions',
            label: 'Impressions',
            total: total => this.displayValue(total),
            render: item => this.displayValue(item.impressions || 0)
        }, {
            value: 'displayRate',
            label: 'Display rate, %',
            render: (item: Performance) => {
                return item.displayRate + '%';
            },
            total: (e, data) => {
                const totalImpressions = data.reduce((s, row) => s + row.impressions, 0);
                const totalWins = data.reduce((s, row) => s + row.wins, 0);
                if (totalImpressions && totalWins) {
                    return numberWithCommas((100 * totalImpressions / totalWins).toFixed(2).toLocaleString()) + '%';
                } else {
                    return 0;
                }
            }
        }, {
            value: 'finishes',
            label: 'Finishes',
            total: total => this.displayValue(total),
            render: item => this.displayValue(item.finishes || 0)
        }, {
            value: 'clicks',
            label: 'Clicks',
            total: total => this.displayValue(total),
            render: item => this.displayValue(item.clicks || 0)
        }, {
            value: 'ctr',
            label: 'CTR, %',
            render: (item: Performance) => {
                return item.ctr + '%';
            },
            total: (e, data) => {
                const totalClicks = data.reduce((s, row) => s + row.clicks, 0);
                const totalImpressions = data.reduce((s, row) => s + row.impressions, 0);
                if (totalImpressions && totalClicks) {
                    return numberWithCommas((100 * totalClicks / totalImpressions).toFixed(2).toLocaleString()) + '%';
                } else {
                    return 0;
                }
            }
        }, {
            value: 'spent',
            label: '$, Spent',
            total: total => numberWithCommas(total.toFixed(2).toLocaleString()),
            render: item => numberWithCommas((item.spent || 0).toFixed(2).toLocaleString())
        }, {
            value: 'ecpm',
            label: '$, eCPM',
            total: (e, data) => {
                const totalImpressions = data.reduce((s, row) => s + row.impressions, 0);
                const totalSpent = data.reduce((s, row) => s + row.spent, 0);
                if (totalImpressions && totalSpent) {
                    return numberWithCommas((1000 * totalSpent / totalImpressions).toFixed(2).toLocaleString());
                } else {
                    return 0;
                }
            },
            render: (item: Performance) => {
                return item.ecpm;
            }
        }, {
            value: 'sspIncome',
            label: '$, SSP Income',
            total: total => numberWithCommas(total.toFixed(2).toLocaleString()),
            render: item => numberWithCommas(item.sspIncome.toFixed(2).toLocaleString())
        }, {
            value: 'exchangeFee',
            label: '$, ExchFee',
            total: total => numberWithCommas(total.toFixed(2).toLocaleString()),
            render: item => numberWithCommas(item.exchangeFee.toFixed(2).toLocaleString())
        }, {
            value: 'feePercents',
            label: 'Fee%',
            total: (_, data) => {
                const totalExchangeFee = data.reduce((accumulator, currentValue) => accumulator + currentValue.exchangeFee, 0);
                const totalSpent = data.reduce((accumulator, currentValue) => accumulator + currentValue.spent, 0);
                return `${(totalExchangeFee / totalSpent * 100).toFixed(2)}%`;
            },
            render: item => `${item.feePercents}%`
        }, {
            value: 'lostImpressions',
            label: 'Lost Imp',
            total: total => this.displayValue(total),
            render: item => this.displayValue(item.lostImpressions || 0)
        }, {
            value: 'lostImpressionsRevenue',
            label: 'Lost Imp Revenue',
            total: total => numberWithCommas(total.toFixed(2).toLocaleString()),
            render: item => numberWithCommas(item.lostImpressionsRevenue.toFixed(2).toLocaleString())
        }].filter((column: Column) => !column.hide)

    private secondColumn(props) {
        const column = {
            hide: props.collection === 'daily',
            render: this.renderSecondColumn.bind(this),
            value: 'dimension'
        } as Column;
        switch (props.collection) {
            case 'adType':
                column.label = 'AdType';
                break;
            case 'country':
                column.label = 'Country';
                break;
            case 'platform':
                column.label = 'Platform';
                break;
            case 'agency':
                column.label = 'Agency';
                break;
            case 'seller':
                column.label = 'SSP';
                break;
        }
        return column;
    }

    private renderSecondColumn(performance: Performance): any {
        const {collection} = this.props;
        switch (collection) {
            case 'adType':
            case 'country':
            case 'platform':
            case 'seller':
                const resource = performance[collection];
                return resource ? resource.label : null;
            case 'agency':
                const {agency} = performance;
                return agency ? agency.label : null;
        }
        return null;
    }

    private updatePerformance = () => {
        if (this.props.collection !== 'daily') {
            this.requestPerformance(
                this.props.startDate,
                this.props.endDate,
                this.props.collection,
                splitDimensions(this.state.selectedDimensions)
            );
        } else {
            this.requestPerformance(this.props.startDate, this.props.endDate, this.props.collection);
        }
    }

    private setTimer = (timeout: number) => {
        this.props.clearTimer();
        if (timeout) {
            this.props.setTimer(setInterval(() => {
                this.updatePerformance();
            }, timeout));
        }
    }

    private loadDimensions = (collection: Collection, startDate: Moment, endDate: Moment) => {
        this.setState({
            loadingDimensions: true,
            dimensions: []
        } as any);
        return getDimensions(
            collection,
            startDate.startOf('day').format('YYYY-MM-DD') + ('T%2B00:00'),
            endDate.endOf('day').format('YYYY-MM-DD') + ('T%2B00:00'))
            .then(response => this.setState({
                dimensions: response.data,
                loadingDimensions: false
            } as any));
    }

    private selectDimensions = selectedDimensions => {
        this.props.clearPerormance();
        this.setState({selectedDimensions} as any);
    }

    private requestPerformance = (startDate: Moment, endDate: Moment, collection: Collection, dimensions?: any[]) => {
        if (collection === 'app' && dimensions.length === 0) {
            this.props.clearPerormance();
        } else {
            this.props.requestPerformance(startDate, endDate, collection, dimensions);
        }
    }

    private requestPerformanceForCollection = () => {
        if (splitDimensions(this.state.selectedDimensions)) {
            this.requestPerformance(
                this.props.startDate,
                this.props.endDate,
                this.props.collection,
                splitDimensions(this.state.selectedDimensions)
            );
        }
    }

    private setAreaGraphic = () => {
        this.setState({graphic: 'area'} as any);
    }

    private setLineGraphic = () => {
        this.setState({graphic: 'line'} as any);
    }

    private setBarGraphic = () => {
        this.setState({graphic: 'bar'} as any);
    }
}

export const PerformanceView = connect<StateProps, DispatchProps, PerformanceViewProps>(
    (state: State) => {
        return {
            startDate: state.statistics.startDate,
            endDate: state.statistics.endDate,
            granularity: state.statistics.granularity,
            loading: state.statistics.loadingPerformance,
            performance: state.statistics.performance.map(item => {
                item.feePercents = (item.exchangeFee / item.spent * 100).toFixed(2);
                return item;
            }),
            timer: state.refresh.timer
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestPerformance: (startDate: Moment, endDate: Moment, collection?: Collection, dimensions?: string[]) => {
                if (startDate && endDate) {
                    const diff = endDate.diff(startDate, 'hours');
                    const granularity: Granularity = diff > 23 ? 'day' : 'hour';
                    return dispatch(requestPerformanceAction(startDate, endDate, collection, granularity, dimensions && dimensions.filter(d => d !== '')));
                }
            },
            clearPerormance: () => dispatch(clearPerformanceAction()),
            setTimer: (timer) => dispatch(setTimerAction(timer)),
            clearTimer: () => dispatch(clearTimerAction())
        };
    }
)(PerformanceViewComponent);
