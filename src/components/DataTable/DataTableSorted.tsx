// import './DataTableSorted.scss';
import * as React from 'react';
import {Component} from 'react';
import {DataTable, TableProps,} from './';
import {SortDirection} from '../../lib/ItemsListState';

interface DataTableSortedProps extends TableProps {
    sortColumn?: string;
    sortDirection?: SortDirection;
}

export class DataTableSorted extends Component<DataTableSortedProps, {
    sortColumn?: string;
    sortDirection?: SortDirection;
}> {
    state = {
        sortColumn: "id",
        sortDirection: (-1) as SortDirection
    };

    componentWillMount() {
        if (this.props.sortColumn) this.state.sortColumn = this.props.sortColumn;
        if (this.props.sortDirection) this.state.sortDirection = this.props.sortDirection;
    }

    render() {
        const {data} = this.props;
        const {sortColumn, sortDirection} = this.state;
        const list = sortColumn && sortDirection !== 0
            ? data.sort((item1, item2) => {
                if (item1[sortColumn] > item2[sortColumn]) {
                    return sortDirection;
                } else if (item1[sortColumn] < item2[sortColumn]) {
                    return -1 * sortDirection;
                } else {
                    return 0;
                }
            })
            : data;
        return <DataTable
            {...this.props}
            data={list}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={this.onSort}/>;
    }

    private onSort = (sortColumn: string, sortDirection: SortDirection) => this.setState({
        sortColumn,
        sortDirection
    } as any);
}
