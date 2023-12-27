import * as React from 'react';
import { Relax } from 'plume2';
import { noop, checkAuth } from 'qmkit';
import { List, Map, fromJS } from 'immutable';
import { Table, Popconfirm } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

declare type IList = List<any>;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class TabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      doDelete: Function;
      propSort: Function;
      showEditModal: Function;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    doDelete: noop,
    showEditModal: noop,
    propSort: noop
  };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <Table
        rowKey="tabId"
        columns={this._columns}
        dataSource={dataList.toJS()}
        onRow={(_record, index) => ({
          index,
          moveRow: this.moveRow
        })}
        components={this.components}
        pagination={false}
        size="middle"
      />
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };
  _columns = [
    {
      title: '模板名称',
      dataIndex: 'tabName',
      key: 'tabName'
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, _record) => this._getOption(_record)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    let hasAuth =
      checkAuth('f_store_goods_tab_1') || checkAuth('f_store_goods_tab_2');

    return (
      <div>
        {/*默认商品详情 展示"-" */}
        {rowInfo.get('isDefault') == 1
          ? '-'
          : hasAuth
            ? [
                // 非默认模板可编辑
                checkAuth('f_store_goods_tab_1') && (
                  <a
                    key="item1"
                    style={styles.edit}
                    onClick={this._showEditModal.bind(
                      this,
                      rowInfo.get('tabId'),
                      rowInfo.get('tabName')
                    )}
                  >
                    编辑
                  </a>
                ),
                checkAuth('f_store_goods_tab_2') && (
                  <Popconfirm
                    title="确认删除?"
                    onConfirm={() => {
                      const { doDelete } = this.props.relaxProps;
                      doDelete(rowInfo.get('tabId'));
                    }}
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                )
              ]
            : '-'}
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (tabId: string, tabName: string) => {
    const { showEditModal } = this.props.relaxProps;
    let tabInfo = Map({
      tabId,
      tabName
    });
    showEditModal(tabInfo);
  };

  moveRow = (dragIndex, hoverIndex) => {
    if (hoverIndex == 0 || dragIndex == 0) {
      return;
    }
    const { dataList, propSort } = this.props.relaxProps;
    const dragRow = dataList.toJS()[dragIndex];
    let sortList = update(dataList.toJS(), {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });
    propSort(sortList);
  };
}
const _rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
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
      index: props.index
    };
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
export default DragDropContext(HTML5Backend)(TabList);
