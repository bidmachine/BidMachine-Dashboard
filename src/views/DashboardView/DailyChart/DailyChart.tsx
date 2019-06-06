import * as React from 'react';

import {connect, Dispatch} from 'react-redux';
import {State} from '../../../reducers';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import * as Select from 'react-select';

import {numberWithCommas} from "../../../lib/format";
import {setFirstLineAction, setLineForBarAction, setSecondLineAction} from '../../../reducers/statistics';

import {Icon} from 'react-icons-kit';
import {square} from 'react-icons-kit/fa/square';

const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#bcbd22",
    "#17becf",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658"
];

export interface StatData {
    name: string;
    impressions: number;
    spent: number;
    bids: number;
    wins: number;
    clicks: number;
    ecpm: number;
    errors: number;
    errorRate: number;
    displayRate: number;
    ctr: number;
    finishes?: number;
    sspIncome?: number;
    exchangeFee?: number;
    agency?: {
        label: string;
        value: string;
    };
    platform?: {
        label: string;
        value: string;
    };
    adType?: {
        label: string;
        value: string;
    };
    country?: {
        label: string;
        value: string;
    };
    seller: {
        label?: string;
        value?: string;
    };
    lostImpressions: number;
    lostImpressionsRevenue: number;
}

interface DailyChartProps {
    data: StatData[];
    graphic: string;
    collection: string;
    dimensions?: string[];
}

interface DailyChartState {
    firstLine?: string;
    secondLine?: string;
    barLine?: string;
}

interface DailyChartFunc {
    setFirstLine: (newLine: string) => any;
    setSecondLine: (newLine: string) => any;
    setLineForBar: (newLine: string) => any;
}

class DailyChartComponent extends React.Component<DailyChartProps & DailyChartState & DailyChartFunc, {
    firstSelectArray: object[];
    secondSelectArray: object[];
    lineBarArray: object[];
    barArray: object[];
    activeDimensions: object[];
    disabledArea: Map<string, number>;
    disabledBar: Map<string, number>;
    rateFlagFirst: boolean;
    rateFlagSecond: boolean;
    lineData: object[];
    areaData: object[];
}> {
    state = {
        firstSelectArray: [],
        secondSelectArray: [],
        lineBarArray: [],
        barArray: [],
        activeDimensions: [],
        disabledArea: new Map(),
        disabledBar: new Map(),
        rateFlagFirst: false,
        rateFlagSecond: false,
        lineData: [],
        areaData: []
    };

    componentDidMount() {
        const {firstLine, secondLine, barLine, dimensions} = this.props;
        const {disabledArea, disabledBar, activeDimensions} = this.state;
        disabledArea.set('bids', 1);
        disabledArea.set('wins', 1);
        disabledArea.set('impressions', 1);
        disabledArea.set('errors', 1);
        if ((firstLine === 'displayRate' || firstLine === 'errorRate' || firstLine === 'ecpm' || firstLine === 'ctr') && dimensions.length !== 1) {
            this.setState({
                rateFlagSecond: true
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                });
            });
        }
        if ((secondLine === 'displayRate' || secondLine === 'errorRate' || secondLine === 'ecpm' || secondLine === 'ctr') && dimensions.length !== 1) {
            this.setState({
                rateFlagFirst: true
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                });
            });
        } else {
            this.setState({
                lineData: this.getArrayForLineDimensions()
            });
        }
        this.setState({
            firstSelectArray: this.getArrayWithoutLine(secondLine),
            secondSelectArray: this.getArrayWithoutLine(firstLine),
            lineBarArray: this.getArrayForBar(),
            barArray: this.getArrayForBarDimensions(barLine),
            disabledArea: disabledArea
        }, () => {
            activeDimensions.map(value => {
                disabledBar.set(value.key, 1);
            });
            this.setState({
                disabledBar: disabledBar
            }, () => {
                this.setState({
                    areaData: this.getArrayForDimensions()
                });
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.graphic !== this.props.graphic) && nextProps.graphic === 'line') {
            const {firstLine, dimensions, secondLine} = this.props;
            if ((firstLine === 'displayRate' || firstLine === 'errorRate' || firstLine === 'ecpm' || firstLine === 'ctr') && dimensions.length !== 1) {
                this.setState({
                    rateFlagSecond: true
                } as any, () => {
                    this.setState({
                        lineData: this.getArrayForLineDimensions()
                    });
                });
            }
            if ((secondLine === 'displayRate' || secondLine === 'errorRate' || secondLine === 'ecpm' || secondLine === 'ctr') && dimensions.length !== 1) {
                this.setState({
                    rateFlagFirst: true
                } as any, () => {
                    this.setState({
                        lineData: this.getArrayForLineDimensions()
                    });
                });
            } else {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                });
            }
        }
        if (nextProps.firstLine !== this.props.firstLine ||
            nextProps.secondLine !== this.props.secondLine ||
            nextProps.barLine !== this.props.barLine) {
            this.setState({
                firstSelectArray: this.getArrayWithoutLine(nextProps.secondLine),
                secondSelectArray: this.getArrayWithoutLine(nextProps.firstLine),
                lineBarArray: this.getArrayForBar(),
                barArray: this.getArrayForBarDimensions(nextProps.barLine),

            });
        }
    }

    render() {
        const {graphic, firstLine, secondLine, barLine, collection} = this.props;
        const {firstSelectArray, secondSelectArray, lineBarArray, barArray, disabledArea, disabledBar, activeDimensions, rateFlagFirst, rateFlagSecond, lineData, areaData} = this.state;
        return <div>
            {graphic === 'line' &&
            <div>
                <div>
                    <ResponsiveContainer width='100%' height={250}>
                        <LineChart data={lineData} className='roboto'>
                            <XAxis dataKey='name'/>
                            <YAxis yAxisId='right' orientation='right' stroke='#E11916'/>
                            <YAxis yAxisId='left' orientation='left' stroke='#5d6b81'/>
                            <Legend verticalAlign='top' height={50}
                                    content={(rateFlagFirst || rateFlagSecond) && collection !== 'daily' ? this.contentLegendBar : null}/>
                            <CartesianGrid strokeDasharray='3 3'/>
                            <Tooltip content={this.renderTooltipContent}/>
                            {rateFlagFirst || rateFlagSecond ?
                                activeDimensions.map((value, i) => {
                                    return (disabledBar.get(value.key) && value.key !== 'other' ? <Line
                                        key={i}
                                        type='monotone'
                                        yAxisId='left'
                                        dataKey={value.key}
                                        stroke={colors[i]}
                                        isAnimationActive={false}
                                        dot={{
                                            stroke: colors[i],
                                            r: 4
                                        }}
                                        fill={colors[i]}/> : null)
                                }) : null
                            }
                            {firstLine !== 'none' && ((!rateFlagFirst && !rateFlagSecond) || collection === 'daily') ?
                                <Line
                                    type='monotone'
                                    yAxisId='left'
                                    dataKey={firstLine}
                                    stroke='#5d6b81'
                                    fillOpacity={0}
                                    isAnimationActive={false}
                                    dot={{
                                        stroke: '#5d6b81',
                                        r: 4
                                    }}/> : null}
                            {secondLine !== 'none' && ((!rateFlagFirst && !rateFlagSecond) || collection === 'daily') ?
                                <Line
                                    type='monotone'
                                    yAxisId='right'
                                    dataKey={secondLine}
                                    stroke='#E11916'
                                    isAnimationActive={false}
                                    dot={{
                                        stroke: '#E11916',
                                        r: 4
                                    }}
                                    fill='#f69f90'/> : null}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className='button-bar'>
                    <div className='step-third'
                         style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {!rateFlagFirst ? <div style={{width: '150px', fontSize: '10pt'}}>
                            <Select
                                searchable={false}
                                clearable={false}
                                wrapperStyle={{flex: 1, marginRight: 1}}
                                simpleValue
                                value={firstLine}
                                options={firstSelectArray}
                                onChange={this.onChangeFirstLine}/>
                        </div> : null}
                        {!rateFlagSecond ? <div style={{width: '150px', fontSize: '10pt'}}>
                            <Select
                                searchable={false}
                                clearable={false}
                                wrapperStyle={{flex: 1, marginRight: 1}}
                                simpleValue
                                value={secondLine}
                                options={secondSelectArray}
                                onChange={this.onChangeSecondLine}/>
                        </div> : null}
                    </div>
                </div>
            </div>}
            {graphic === 'area' &&
            <div>
                <ResponsiveContainer width='100%' height={250}>
                    <AreaChart
                        className='roboto'
                        data={areaData.map(value => {
                            return {
                                timestamp: value.name,
                                wins: value.wins,
                                errors: value.errors,
                                impressions: value.impressions,
                                bids: value.bids
                            }
                        })}
                        stackOffset='expand'>
                        <XAxis dataKey='timestamp'/>
                        <YAxis/>
                        <Legend verticalAlign='top' height={50} content={this.contentLegendArea}/>
                        <CartesianGrid strokeDasharray='3 3'/>
                        <Tooltip content={this.renderTooltipContent}/>
                        {disabledArea.get('bids') !== 0 ?
                            <Area animationDuration={500} type='monotone' fillOpacity='0.99' dataKey='bids'
                                  stroke="#8884d8" fill='#8884d8'></Area> : null}
                        {disabledArea.get('wins') !== 0 ?
                            <Area animationDuration={500} type='monotone' fillOpacity='0.99' dataKey='wins'
                                  stroke="#ffc658" fill='#ffc658'></Area> : null}
                        {disabledArea.get('errors') !== 0 ?
                            <Area animationDuration={500} type='monotone' fillOpacity='0.99' dataKey='errors'
                                  stroke="#E11916" fill='#E11916'></Area> : null}
                        {disabledArea.get('impressions') !== 0 ?
                            <Area animationDuration={500} type='monotone' dataKey='impressions' stroke="#82ca9d"
                                  fill="#82ca9d"></Area> : null}
                    </AreaChart>
                </ResponsiveContainer>
            </div>}

            {graphic === 'bar' &&
            <div>
                <div>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart
                            className='roboto'
                            width={600} height={300}
                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                            data={barArray}
                        >
                            <XAxis dataKey='name'/>
                            <YAxis/>
                            <Legend verticalAlign='top' height={50} content={this.contentLegendBar}/>
                            <CartesianGrid strokeDasharray='3 3'/>
                            <Tooltip content={this.renderTooltipContent}/>
                            {activeDimensions.map((value, i) => disabledBar.get(value.key) !== 0 ?
                                <Bar isAnimationActive={false} key={i} type='monotone' dataKey={value.key} stackId="a"
                                     fill={colors[i]}/> : null)}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='button-bar'>
                    <div style={{width: '150px', fontSize: '10pt'}}>
                        <Select
                            searchable={false}
                            clearable={false}
                            wrapperStyle={{flex: 1, marginRight: 4, padding: 0}}
                            simpleValue
                            value={barLine}
                            options={lineBarArray}
                            onChange={this.onChangeLineBarArray}/>
                    </div>
                </div>
            </div>}
        </div>;
    }

    private getArrayForSelect = () => {
        const {data} = this.props;
        let arr = [];
        Object.keys(data[0]).forEach((value, key) => {
            if (value !== 'agency' && value !== 'adType' && value !== 'platform' && value !== 'country' && value !== 'seller') {
                arr[key] = value;
            }
        });
        return arr;
    }

    private getValue = (value: string) => {
        switch (value) {
            case 'name':
                return 'None';
            case 'sspIncome':
                return 'SSP Income';
                ;
            case 'ctr':
                return 'CTR';
            case 'ecpm':
                return 'eCPM';
            case 'errorRate':
                return 'Error rate';
            case 'displayRate':
                return 'Display rate';
            case 'exchangeFee':
                return 'Exchange Fee';
            case 'lostImpressions':
                return 'Lost Impressions';
            case 'lostImpressionsRevenue':
                return 'Lost Impressions Revenue';
            default:
                return value.slice(0, 1).toUpperCase() + value.slice(1, value.length);
        }
        ;
    }

    private getArrayForBar = () => {
        const allPerformanceArray = this.getArrayForSelect();
        return allPerformanceArray.filter(value => {
            return value !== 'errorRate' && value !== 'displayRate' && value !== 'ctr' && value !== 'ecpm' && value !== 'name';
        }).map(value => {
            let newVal = value;
            let newLab = this.getValue(value);
            return {
                value: newVal,
                label: newLab
            };
        });
    }

    private getArrayWithoutLine = (line: string) => {
        const allPerformanceArray = this.getArrayForSelect();
        let lineTmp = line === 'none' ? 'name' : line;
        const arr = allPerformanceArray.filter(value => {
            return value !== lineTmp;
        });
        return arr.map(value => {
            let newVal = value !== 'name' ? value : 'none';
            let newLab = this.getValue(value);
            return {
                value: newVal,
                label: newLab
            };
        });
    }

    private onChangeFirstLine = (newValue) => {
        if (this.props.collection !== 'daily' && this.props.dimensions.length > 1 && (newValue === 'displayRate' || newValue === 'errorRate' || newValue === 'ecpm' || newValue === 'ctr')) {
            this.props.setFirstLine(newValue);
            this.props.setSecondLine('none');
            this.setState({
                rateFlagSecond: true
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                }, () => {
                    const {dimensions} = this.props;
                    const {disabledBar, activeDimensions} = this.state;
                    if (dimensions.length > 10) {
                        Array.from(disabledBar.keys()).map(value => {
                            if (activeDimensions.findIndex(val => val.key === value) === -1) {
                                disabledBar.delete(value);
                            }
                        });
                        activeDimensions.map(value => {
                            if (Array.from(disabledBar.keys()).findIndex(val => val === value.key) === -1) {
                                disabledBar.set(value.key, 1);
                            }
                        });
                    }
                    this.setState({
                        disabledBar: disabledBar
                    }, () => {
                        this.setState({
                            areaData: this.getArrayForDimensions()
                        })
                    });
                });
            });
        } else {
            this.props.setFirstLine(newValue);
            this.setState({
                secondSelectArray: this.getArrayWithoutLine(newValue),
                rateFlagSecond: false
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                });
            });
        }
    };

    private onChangeSecondLine = (newValue) => {
        if (this.props.collection !== 'daily' && this.props.dimensions.length > 1 && (newValue === 'displayRate' || newValue === 'errorRate' || newValue === 'ecpm' || newValue === 'ctr')) {
            this.props.setSecondLine(newValue);
            this.props.setFirstLine('none');
            this.setState({
                rateFlagFirst: true
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                }, () => {
                    const {dimensions} = this.props;
                    const {disabledBar, activeDimensions} = this.state;
                    if (dimensions.length > 10) {
                        Array.from(disabledBar.keys()).map(value => {
                            if (activeDimensions.findIndex(val => val.key === value) === -1) {
                                disabledBar.delete(value);
                            }
                        });
                        activeDimensions.map(value => {
                            if (Array.from(disabledBar.keys()).findIndex(val => val === value.key) === -1) {
                                disabledBar.set(value.key, 1);
                            }
                        });
                    }
                    this.setState({
                        disabledBar: disabledBar
                    }, () => {
                        this.setState({
                            areaData: this.getArrayForDimensions()
                        })
                    });
                });
            });
        } else {
            this.props.setSecondLine(newValue);
            this.setState({
                firstSelectArray: this.getArrayWithoutLine(newValue),
                rateFlagFirst: false
            } as any, () => {
                this.setState({
                    lineData: this.getArrayForLineDimensions()
                });
            });
        }
    };

    private onChangeLineBarArray = (newValue) => {
        this.props.setLineForBar(newValue);
        this.setState({
            barArray: this.getArrayForBarDimensions(this.props.barLine)
        } as any, () => {
            const {dimensions} = this.props;
            const {disabledBar, activeDimensions} = this.state;
            if (dimensions.length > 10) {
                Array.from(disabledBar.keys()).map(value => {
                    if (activeDimensions.findIndex(val => val.key === value) === -1) {
                        disabledBar.delete(value);
                    }
                });
                activeDimensions.map(value => {
                    if (Array.from(disabledBar.keys()).findIndex(val => val === value.key) === -1) {
                        disabledBar.set(value.key, 1);
                    }
                });
            }
            this.setState({
                disabledBar: disabledBar
            }, () => {
                this.setState({
                    areaData: this.getArrayForDimensions()
                })
            });
        });
    }

    private renderTooltipContent = (o) => {
        const {payload, label} = o;
        return (
            <div className='chart-tooltip-content'>
                <p className='total'>{`${label}`}</p>
                <ul className='list'>
                    {
                        payload.map((entry, index) => {
                            if (entry.value || entry.value === 0) {
                                return (<li key={`item-${index}`} style={{color: entry.color}}>
                                    {`${entry.name}: ${numberWithCommas(Math.round(entry.value * 100) / 100)}`}
                                </li>)
                            }
                        })
                    }
                </ul>
            </div>
        );
    };

    private getArrayForBarDimensions = (barLine) => {
        const {data} = this.props;
        const {activeDimensions} = this.state;
        activeDimensions.splice(0, activeDimensions.length);
        const arr = data.map((value, i) => {
            const line = value.country ? value.country.label : value.adType ? value.adType.label : value.platform ? value.platform.label : value.agency ? value.agency.label : value.seller ? value.seller.label : null;
            let tmp = {
                name: value.name
            };
            tmp[line] = value[barLine];
            return tmp;
        });
        let mapArr = arr.reduce((map, value, index, arr) => {
            if (map.has(value.name)) {
                const mapValue = map.get(value.name);
                let data = {};
                Object.assign(data, value, mapValue);
                map.set(value.name, data);
            } else {
                map.set(value.name, value);
            }
            return map;
        }, new Map());
        let newData = Array.from(mapArr.values())
        newData = newData.map((value, i) => {
            var arr = [];
            for (let key in value) {
                if (key !== 'name') arr.push({key: key, value: value[key]});
            }
            if (arr.length < 11) {
                return value;
            }
            if (activeDimensions.findIndex(value => value === 'other') !== -1) activeDimensions.push({
                key: 'other',
                value: newData.pop
            });
            arr.sort((a, b) => {
                if (a.value > b.value) {
                    return -1;
                }
                if (a.value < b.value) {
                    return 1;
                }
                return 0;
            });
            value['other'] = 0;
            for (let i = 10; i < arr.length; i++) {
                value['other'] += arr[i].value;
                delete value[arr[i].key];
            }
            return value;
        });
        newData.map(value => {
            for (let key in value) {
                key !== 'name' ? activeDimensions.push({key: key, value: value[key]}) : null;
            }
        });
        this.setState({
            activeDimensions: this.unique(activeDimensions.concat(this.state.activeDimensions, activeDimensions).sort((a, b) => {
                if (a.value > b.value) {
                    return -1;
                }
                if (a.value < b.value) {
                    return 1;
                }
                return 0;
            }))
        } as any);
        return newData;
    }

    private getArrayForDimensions = () => {
        if (this.props.collection === 'daily' || this.props.dimensions.length === 1) return this.props.data;
        const arr = this.props.data;
        const {graphic} = this.props;
        const {disabledBar} = this.state;
        var mapArr = new Map();
        arr.map((value) => {
            const line = value.country ? value.country.label : value.adType ? value.adType.label : value.platform ? value.platform.label : value.agency ? value.agency.label : value.seller ? value.seller.label : null;
            if (graphic === 'line' || Array.from(disabledBar.keys()).findIndex(val => val === line && disabledBar.get(line) !== 0) > -1) {
                if (mapArr.has(value.name)) {
                    const mapValue = mapArr.get(value.name);
                    const data = {
                        name: mapValue.name,
                        bids: mapValue.bids + value.bids || 0,
                        impressions: mapValue.impressions + value.impressions || 0,
                        spent: mapValue.spent + value.spent || 0,
                        wins: mapValue.wins + value.wins || 0,
                        clicks: mapValue.clicks + value.clicks || 0,
                        errors: mapValue.errors + value.errors || 0,
                        finishes: mapValue.finishes !== null ? mapValue.finishes + value.finishes || 0 : null,
                        sspIncome: mapValue.finishes !== null ? mapValue.sspIncome + value.sspIncome || 0 : null,
                        exchangeFee: mapValue.exchangeFee !== null ? mapValue.exchangeFee + value.exchangeFee || 0 : null,
                        lostImpressions: mapValue.lostImpressions !== null ? mapValue.lostImpressions + value.lostImpressions || 0 : null,
                        lostImpressionsRevenue: mapValue.lostImpressionsRevenue !== null ? mapValue.lostImpressionsRevenue + value.lostImpressionsRevenue || 0 : null
                    };
                    mapArr.set(value.name, data);
                } else {
                    mapArr.set(value.name, value);
                }
            }
        })
        return Array.from(mapArr.values());
    }

    private unique = (arr) => {
        let mas = [];
        arr.map(val => {
            if (mas.findIndex(value => value.key === val.key) === -1) mas.push(val);
        });
        return mas;
    }

    private clickLegendArea = (event) => {
        const {disabledArea} = this.state;
        const current = disabledArea.get(event.target.outerText);
        const tmp = Array.from(disabledArea.values()).reduce((acc, cur) => {
            return cur === 1 ? acc += cur : acc;
        }, 0);
        if (tmp > 1 || current === 0) {
            if (current !== 0) {
                return this.setState({
                    disabledArea: disabledArea.set(event.target.outerText, 0)
                });
            }
            this.setState({
                disabledArea: disabledArea.set(event.target.outerText, 1)
            });
        }
    }

    private clickLegendBar = (event) => {
        const {disabledBar} = this.state;
        const {barLine, graphic} = this.props;
        const current = disabledBar.get(event.target.outerText);
        if (disabledBar.get('other') && graphic === 'line') disabledBar.delete('other');
        const tmp = Array.from(disabledBar.values()).reduce((acc, cur) => {
            return cur === 1 ? acc += cur : acc;
        }, 0);
        if (tmp > 1 || current === 0) {
            if (current !== 0) {
                return this.setState({
                    disabledBar: disabledBar.set(event.target.outerText, 0),
                    barArray: this.getArrayForBarDimensions(barLine),
                    lineData: this.getArrayForLineDimensions()
                }, () => {
                    this.setState({
                        areaData: this.getArrayForDimensions()
                    })
                });
            }
            this.setState({
                disabledBar: disabledBar.set(event.target.outerText, 1),
                barArray: this.getArrayForBarDimensions(barLine),
                lineData: this.getArrayForLineDimensions()
            }, () => {
                this.setState({
                    areaData: this.getArrayForDimensions()
                })
            });
        }
    }

    private contentLegendArea = ({payload}) => {
        const {disabledArea, disabledBar} = this.state;
        const {graphic, collection} = this.props;
        return (
            <div style={{textAlign: 'center'}}>
                <div className='step-seventh'>{
                    Array.from(disabledArea.keys()).map((entry, index) => {
                        let color = '#dce3e7';
                        const ind = payload.findIndex(value => value.dataKey === entry);
                        if (payload[ind]) {
                            if (ind !== -1) color = payload[ind].color;
                        }
                        return (<div key={`item-${index}`}
                                     style={{color: color, display: 'inline-block', marginRight: '5px'}}>
                            <Icon size={10} icon={square} style={{backgroundColor: color}}/>
                            <div style={{display: 'inline-block', marginLeft: '5px'}}
                                 onClick={this.clickLegendArea}>{`${entry}`}</div>
                        </div>)
                    })
                }</div>
                {collection !== 'daily' && <div style={{
                    marginTop: '1em',
                    marginBottom: '1em'
                }}>{Array.from(disabledBar.keys()).map((entry, index) => {
                    if (entry === 'other' && graphic === 'line') {
                        return null;
                    }
                    let color = '#dce3e7';
                    const ind = disabledBar.get(entry);
                    if (ind !== 0) {
                        color = '#3A4354';
                    }
                    return (
                        <div key={`item-${index}`} style={{color: color, display: 'inline-block', marginRight: '5px'}}>
                            <div style={{display: 'inline-block', marginLeft: '5px'}}
                                 onClick={this.clickLegendBar}>{`${entry}`}</div>
                        </div>)
                })
                }</div>}
            </div>
        );
    }

    private contentLegendBar = ({payload}) => {
        const {disabledBar} = this.state;
        const {graphic} = this.props;
        return (
            <div style={{textAlign: 'center'}}>
                {
                    Array.from(disabledBar.keys()).map((entry, index) => {
                        if (entry === 'other' && graphic === 'line') {
                            return null;
                        }
                        let color = '#dce3e7';
                        const ind = payload.findIndex(value => value.dataKey === entry);
                        if (payload[ind]) {
                            if (ind !== -1) color = payload[ind].color;
                        }
                        return (<div key={`item-${index}`}
                                     style={{color: color, display: 'inline-block', marginRight: '5px'}}>
                            <Icon size={10} icon={square} style={{backgroundColor: color}}/>
                            <div style={{display: 'inline-block', marginLeft: '5px'}}
                                 onClick={this.clickLegendBar}>{`${entry}`}</div>
                        </div>)
                    })
                }
            </div>
        );
    }

    private getArrayForLineDimensions = () => {
        if (this.props.collection === 'daily' || this.props.dimensions.length === 1) return this.props.data;
        if (this.props.firstLine === 'displayRate' || this.props.firstLine === 'errorRate' || this.props.firstLine === 'ecpm' || this.props.firstLine === 'ctr') {
            this.setState({
                rateFlagSecond: true
            } as any, () => {
                return
            });
        }
        const {rateFlagFirst, rateFlagSecond} = this.state;
        const {firstLine, secondLine, data} = this.props;
        if (!rateFlagFirst && !rateFlagSecond) return this.getArrayForDimensions();
        const lineGraphic = rateFlagFirst ? secondLine : firstLine;
        const arr = data.map((value, i) => {
            const line = value.country ? value.country.label : value.adType ? value.adType.label : value.platform ? value.platform.label : value.agency ? value.agency.label : value.seller ? value.seller.label : null;
            let tmp = {
                name: value.name
            };
            tmp[line] = value[lineGraphic];
            return tmp;
        });
        let mapArr = arr.reduce((map, value, index, arr) => {
            if (map.has(value.name)) {
                const mapValue = map.get(value.name);
                let data = {};
                Object.assign(data, value, mapValue);
                map.set(value.name, data);
            } else {
                map.set(value.name, value);
            }
            return map;
        }, new Map());
        let newData = Array.from(mapArr.values())
        newData = newData.map((value, i) => {
            var arr = [];
            for (let key in value) {
                if (key !== 'name') arr.push({key: key, value: value[key]});
            }
            return value;
        });
        return newData;
    }
}

export const DailyChart = connect<DailyChartState, DailyChartFunc, DailyChartProps>(
    (state: State) => {
        return {
            firstLine: state.statistics.firstLine,
            secondLine: state.statistics.secondLine,
            barLine: state.statistics.barLine
        } as any;
    },
    (dispatch: Dispatch<any>) => {
        return {
            setFirstLine: (newLine: string) => dispatch(setFirstLineAction(newLine)),
            setSecondLine: (newLine: string) => dispatch(setSecondLineAction(newLine)),
            setLineForBar: (newLine: string) => dispatch(setLineForBarAction(newLine))
        };
    },
)(DailyChartComponent);
