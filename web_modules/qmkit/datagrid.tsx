import { Table } from 'antd';
import * as React from 'react';
import StoreTable from 'antd/lib/table/Table';
export default class  DataGrid<T> extends React.Component<StoreTable<T>> {
  constructor(props){
    super(props);
  }
  render(){
    const isScroll = this.props.isScroll === undefined ;
    const scroll = this.props.scroll || 0;
    return <Table {...this.props} scroll={isScroll ?{x:'max-content',y:scroll.y}:{}} />
  }
}


