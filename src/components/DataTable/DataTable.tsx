import './DataTable.scss';
import * as React from 'react';
import {ClassAttributes, Component, ReactNode} from 'react';
import {SortDirection} from '../../lib/ItemsListState';
import {Button} from '../../components/Button';

export function renderBoolean(item: any, value: string) {
    return <i className={`fa fa-${item[value] ? 'check-square' : 'square-o'}`}/>;
}

export function renderTags(items: any[]) {
    return items.map((i, j) => <div key={j} className='tag'>{i}</div>);
}

export function renderTag(item: any, i: number) {
    return <div key={i} className='tag'>{item}</div>;
}

export function renderTimestamp(item: any, i: number) {
    return 'time';
}

export interface Column {
    value: string;
    label: string;
    className?: string;
    width?: number;
    hide?: boolean;
    style?: any; // React.HTMLAttributes<HTMLTableDataCellElement>;
    nosort?: boolean;
    total?: boolean | string | ((value: number, data?: any[]) => any);
    render?: (item, value?) => JSX.Element | JSX.Element[] | string | number;
    getValue?: (item) => string | number | boolean;
}

export interface TableProps {
    columns: Column[];
    data: any[];
    total?: boolean;
    exportable?: boolean;
    customize?: boolean;
    customizeStore?: string;
    buttons?: ReactNode[];
}

export interface DataTableProps extends TableProps, ClassAttributes<DataTable> {
    sortColumn?: string;
    sortDirection?: SortDirection;
    onSort?: (column: string, direction: SortDirection) => any;
}

export interface DataTableState {
    visibleColumns: string[];
    visibleColumnsEdit: boolean;
}

function nextSort(direction: SortDirection): SortDirection {
    switch (direction) {
        case -1:
            return 0 as SortDirection;
        case 0:
            return 1 as SortDirection;
        case 1:
            return (-1) as SortDirection;
        default:
            return 1 as SortDirection;
    }
}

function renderCell(item: any, column: Column) {
    if (column.render) {
        return column.render(item, column.value);
    } else {
        const field = item[column.value];
        if (field) {
            return field;
        } else {
            return null;
        }
    }
}

export class DataTable extends Component<DataTableProps, DataTableState> {
    static defaultProps = {
        sortDirection: 0,
        exportable: true
    };

    constructor(props: DataTableProps) {
        super(props);
        props.columns.map(column => column.label);
        this.state = {
            visibleColumnsEdit: false,
            visibleColumns: this.restoreSelectedColumns(props.columns.map(column => column.label))
        };
    }

    keySelectedColumns() {
        const {customizeStore} = this.props;
        return customizeStore ? `${customizeStore}.visibleColumns` : null;
    }

    saveSelectedColumns() {
        const {visibleColumns} = this.state;
        const key = this.keySelectedColumns();
        if (key) { localStorage.setItem(this.keySelectedColumns(), JSON.stringify(visibleColumns)); }
    }

    restoreSelectedColumns(columns) {
        const key = this.keySelectedColumns();
        if (!key) { return columns; }
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : columns;
    }

    componentDidUpdate(prevProps: DataTableProps, prevState: DataTableState) {
        this.saveSelectedColumns();
    }

    renderColumnEditor() {
        const {columns} = this.props;
        const {visibleColumns} = this.state;
        return (
            <tr>
                {columns.filter((column) => !column.hide).map((column, i) => {
                    const index = visibleColumns.indexOf(column.label);
                    return (
                        <th key={column.label} style={{textAlign: 'center'}}>
                            <i className={`fa fa-${index >= 0 ? 'check-' : ''}square`} style={{cursor: 'pointer'}}
                               onClick={() => {
                                   index >= 0 ? visibleColumns.splice(index, 1) : visibleColumns.push(column.label);
                                   this.setState({visibleColumns} as any);
                               }}/>
                        </th>
                    );
                })}
            </tr>
        );

    }

    render() {
        const {columns, sortDirection, sortColumn, onSort, exportable, customize, buttons} = this.props;
        const {visibleColumnsEdit} = this.state;
        return <div className='table-wrapper'>
            <div className='table-toolbar'>
                {buttons && <div>
                    {buttons}
                    <div className="space-w10"/>
                </div>}
                {customize &&
                <Button key="columns" onClick={() => this.setState({visibleColumnsEdit: !visibleColumnsEdit} as any)}
                        className={`small ${visibleColumnsEdit && 'primary'}`}
                        iconLeft='fa fa-columns'>Columns</Button>}

                {exportable &&
                <Button key="export" onClick={this.export} className='small' iconLeft='fa fa-table'>CSV Export</Button>}
            </div>
            <table className='data-table'>
                <thead>
                {visibleColumnsEdit && this.renderColumnEditor()}
                <tr>
                    {
                        columns.filter(this.columnFilter).map((column, i) => {
                            return <th
                                style={column.label.toLowerCase() !== 'countries' ? column.style : {}}
                                // width={column.width}
                                key={i}
                                className={column.className + (onSort ? ' sortable' : '')}
                                onClick={() => !column.nosort && onSort && onSort(column.value, nextSort(column.value === sortColumn ? sortDirection : null))}>
                                {column.label}{!column.nosort && onSort && this.renderColumnSort(column)}
                            </th>;
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {this.renderData()}
                {this.props.total && this.renderTotal()}
                </tbody>
            </table>
        </div>;
    }

    private export = () => {
        const {data, columns} = this.props;
        const rendered = data.map((item) => columns.reduce((row, column) => {
            if (column.value || column.getValue) {
                const value = column.getValue
                    ? column.getValue(item)
                    : item[column.value] !== undefined
                        ? item[column.value]
                        : '';
                row.push(value);
            }
            return row;
        }, []).join(','));

        rendered
            .unshift(columns
                .filter(column => column.value || column.getValue)
                .map(column => column.label.replace(',', ' ')).join(','));

        const csvFile = rendered.join('\n');
        const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});

        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'exported.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    private renderData() {
        const {data, columns} = this.props;
        return data.map((item, i) => <tr key={i}>
            {
                columns.filter(this.columnFilter).map((column, j) => <td key={j} className={column.className}
                                                                         style={item.worldwide && column.label.toLowerCase() === 'countries' ? column.style : {}}>
                    {
                        renderCell(item, column)
                    }
                </td>)
            }
        </tr>);
    }

    private renderColumnSort(column: Column) {
        const {sortColumn, sortDirection} = this.props;
        if (sortColumn === column.value && sortDirection !== 0) {
            return <i
                className={`sort-header fa fa-sort-amount-${sortDirection === 1 ? 'asc' : 'desc'}`}/>;
        } else {
            return <i
                className='sort-header fa fa-sort'/>;
        }
    }

    private columnFilter = (column) => {
        const {visibleColumns, visibleColumnsEdit} = this.state;
        return !column.hide && (visibleColumnsEdit || visibleColumns.indexOf(column.label) >= 0);
    }

    private renderTotal() {
        return <tr className='total'>
            {
                this.props.columns.filter(this.columnFilter).map((column, i) => {
                    if (typeof column.total === 'string') {
                        return <td key={i}>{column.total}</td>;
                    } else if (column.total) {
                        const total = this.props.data.reduce((sum, item) => sum + (item[column.value] || null), 0);
                        if (typeof column.total === 'function') {
                            return <td key={i}>{column.total(total, this.props.data)}</td>;
                        } else {
                            return <td key={i}>{total}</td>;
                        }
                    } else {
                        return <td key={i}/>;
                    }
                })
            }
        </tr>;
    }
}
