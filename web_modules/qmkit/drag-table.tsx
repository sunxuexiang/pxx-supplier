import React, { Component } from 'react';
import { Table } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';

class list extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      checkRowKeys: [],
      selectedRows: []
    };
  }
  // 翻页
  initTable = (pageNum) => {
    this.props.changeData(pageNum);
  };
  // 分页参数处理
  pageParamsDeal = () => {
    const { pagination, total } = this.props;
    if (pagination) {
      return {
        current: pagination.pageNum + 1,
        pageSize: pagination.pageSize,
        total: total,
        onChange: (pageNum) => {
          this.initTable(pageNum);
        }
      };
    } else {
      return false;
    }
  };
  // 列表选择
  tableSelect = (selectedRowKeys, selectedRows) => {
    this.setState(
      {
        checkRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
        selectedRowKeys: selectedRowKeys
      },
      () => {
        const { selectedRowKeys, checkRowKeys, selectedRows } = this.state;
        this.props.changeTableSelect(
          selectedRowKeys,
          checkRowKeys,
          selectedRows
        );
      }
    );
  };
  render() {
    const { dragColumns, dragData, loading } = this.props;

    return (
      <div>
        <Table
          loading={loading}
          rowKey={(record: any) =>
            this.props.rowKeyName ? record[this.props.rowKeyName] : ''
          }
          rowSelection={
            this.props.rowSelection
              ? {
                  selectedRowKeys: this.state.selectedRowKeys,
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.tableSelect(selectedRowKeys, selectedRows);
                  }
                }
              : null
          }
          columns={dragColumns}
          dataSource={dragData}
          onRow={(_record, index) => ({
            index,
            moveRow: this._moveRow
          })}
          pagination={this.pageParamsDeal()}
          scroll={this.props.scroll ? this.props.scroll : {}}
          components={this.components}
        />
      </div>
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = async (cateId = '', dragIndex, hoverIndex) => {
    console.log(dragIndex, hoverIndex, 'cateId, dragIndex, hoverIndex');
    this.props.changeSort(dragIndex, hoverIndex);
  };
}

let _dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
};

let _BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
};

const _rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
      cateInfo: props.children[0].props.record
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    //源对象
    const sourceCate = monitor.getItem().cateInfo;
    //目标对象
    const targetCate = props.children[0].props.record;
    //判断两个拖拽目标是不是同一级
    if (sourceCate.cateParentId != targetCate.cateParentId) {
      return;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(sourceCate.cateId, dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

_BodyRow = DropTarget('row', _rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', _rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(_BodyRow)
);

export default DragDropContext(HTML5Backend)(list);
