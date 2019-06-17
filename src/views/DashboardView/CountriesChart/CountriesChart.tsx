import './CountriesChart.scss';
import * as React from 'react';
import {Component} from 'react';
import moment, {Moment} from 'moment';
import {requestGraphPerformance} from '../../../lib/api';

import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Button} from '../../../components/Button';

const colors = [
    "#d50000",
    "#ff1744",
    "#ff5252",
    "#ff8a80",
    "#b71c1c",
    "#c62828",
    "#d32f2f",
    "#e53935",
    "#f44336",
    "#ef5350",
    "#e57373",
    "#ef9a9a",
    "#ffcdd2",
    "#ffebee"
];

export interface StatData {
    name: string;
    impressions: number;
    spent: number;
}

const toPercent = (decimal, fixed = 0) => {
    return `${(decimal * 100).toFixed(fixed)}%`;
};

const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
    const {payload, label} = o;
    const total = payload.reduce((result, entry) => (result + entry.value), 0);

    return (
        <div className='country-chart-tooltip-content'>
            <p className='total'>{`${label} (Total: ${total})`}</p>
            <ul className='list'>
                {
                    payload.map((entry, index) => (
                        <li key={`item-${index}`} style={{color: entry.color}}>
                            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

type Dimension = 'impressions' | 'spent';

export class CountriesChart extends Component<{
    startDate: Moment;
    endDate: Moment;
    countries: string;
}, { data: any[], loading: boolean; dimension: Dimension }> {
    state = {
        data: [],
        loading: false,
        dimension: 'impressions' as Dimension
    };
    setImpressions = () => this.requestData(
        this.props.startDate.format('YYYY-MM-DD'),
        this.props.endDate.format('YYYY-MM-DD'),
        this.props.countries,
        'impressions'
    )
    setSpent = () => this.requestData(
        this.props.startDate.format('YYYY-MM-DD'),
        this.props.endDate.format('YYYY-MM-DD'),
        this.props.countries,
        'spent'
    )

    componentDidMount() {
        this.requestData(
            this.props.startDate.format(),
            this.props.endDate.format(),
            this.props.countries,
            this.state.dimension
        );
    }

    componentWillReceiveProps(next) {
        if (
            next.startDate !== this.props.startDate ||
            next.endDate !== this.props.endDate ||
            next.countries !== this.props.countries
        ) {
            if (next.endDate && next.startDate) {
                this.requestData(
                    next.startDate.format(),
                    next.endDate.format(),
                    next.countries,
                    this.state.dimension
                );
            }
        }
    }

    shouldComponentUpdate(props, state) {
        return props.startDate !== this.props.startDate ||
            props.endDate !== this.props.endDate ||
            props.countries !== this.props.countries ||
            state.data !== this.state.data;
    }

    renderChart() {
        if (!this.state.loading && this.state.data && this.state.data.length > 0) {
            const countries = Object.keys(this.state.data[0]).slice(1);
            return <ResponsiveContainer width='100%' height={400}>
                <AreaChart
                    className='roboto'
                    data={this.state.data.map(stat => {
                        return {
                            ...stat,
                            timestamp: moment(stat.timestamp).format('MM.DD HH:00')
                        };
                    })}
                    stackOffset='expand'>
                    <XAxis dataKey='timestamp'/>
                    <YAxis tickFormatter={toPercent}/>
                    <Legend verticalAlign='top' height={36}/>
                    <CartesianGrid strokeDasharray='3 3'/>
                    <Tooltip content={renderTooltipContent}/>
                    {countries.map((country, i) => {
                        return <Area
                            isAnimationActive={false}
                            key={i}
                            type='monotone'
                            dataKey={country}
                            stackId='1'
                            stroke={colors[i]}
                            fill={colors[i]}/>;
                    })}
                </AreaChart>
            </ResponsiveContainer>;
        } else {
            return null;
        }
    }

    render() {
        return <div>
            {this.renderChart()}
            <div className='button-bar'>
                <Button className={`small ${this.state.dimension === 'impressions' ? 'primary' : ''}`}
                        onClick={this.setImpressions}>Impressions</Button>
                <Button className={`small ${this.state.dimension === 'spent' ? 'primary' : ''}`}
                        onClick={this.setSpent}>Spent</Button>
            </div>
        </div>;
    }

    private requestData = (startDate: string,
                           endDate: string,
                           countries: string,
                           dimension: Dimension) => {
        this.setState({data: [], loading: true, dimension} as any);
        requestGraphPerformance(startDate, endDate, 'country', dimension, countries)
            .then(response => {
                this.setState({data: response.data, loading: false} as any);
            })
            .catch(() => this.setState({data: [], loading: false} as any));
    }
}
