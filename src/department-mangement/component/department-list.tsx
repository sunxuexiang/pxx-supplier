import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Modal, Table, Icon } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, AuthWrapper } from 'qmkit';

declare type IList = List<any>;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class DepartmentList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      departments: IList;
      allDepartments: IList;

      cateSort: Function;
      showEditModal: Function;
      showLeaderModal: Function;
      doDelete: Function;
    };
  };

  static relaxProps = {
    // 父子结构的部门
    departments: 'departments',
    // 平台全部部门集合
    allDepartments: 'allDepartments',

    //拖拽排序
    cateSort: noop,
    // 展示修改框
    showEditModal: noop,
    showLeaderModal: noop,
    // 删除
    doDelete: noop
  };

  render() {
    const { departments } = this.props.relaxProps;
    return (
      <Table
        rowKey="departmentId"
        columns={this._columns}
        dataSource={departments.toJS()}
        components={this.components}
        pagination={false}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
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
      title: '部门名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      className: 'namerow'
    },
    {
      title: '主管',
      key: 'employeeName',
      render: (rowInfo) => this._setDirector(rowInfo)
    },
    {
      title: '员工数',
      dataIndex: 'employeeNum',
      key: 'employeeNum'
    },
    {
      title: '操作',
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];
  _setDirector = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    return rowInfo && rowInfo.get('employeeId') ? (
      <AuthWrapper functionName={'f_department_modify_leader'}>
        <a
          style={styles.edit}
          onClick={this._showLeadrModal.bind(
            this,
            rowInfo.get('departmentId'),
            rowInfo.get('departmentName'),
            rowInfo.get('parentDepartmentId'),
            rowInfo.get('parentDepartmentIds'),
            rowInfo.get('employeeId'),
            rowInfo.get('employeeName'),
            rowInfo.get('employeeNum')
          )}
        >
          <Icon type="edit" />
          {rowInfo.get('employeeName')}
        </a>
      </AuthWrapper>
    ) : (
      <AuthWrapper functionName={'f_department_modify_leader'}>
        <a
          style={styles.edit}
          onClick={this._showLeadrModal.bind(
            this,
            rowInfo.get('departmentId'),
            rowInfo.get('departmentName'),
            rowInfo.get('parentDepartmentId'),
            rowInfo.get('parentDepartmentIds'),
            '',
            '',
            rowInfo.get('employeeNum')
          )}
        >
          <Icon type="edit" /> -
        </a>
      </AuthWrapper>
    );
  };

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    rowInfo = fromJS(rowInfo);
    return (
      <div>
        <AuthWrapper functionName={'f_department_add_node'}>
          <a
            style={styles.edit}
            onClick={this._addChildrenCate.bind(
              this,
              rowInfo.get('departmentId'),
              rowInfo.get('departmentName'),
              rowInfo.get('departmentGrade')
            )}
          >
            添加子部门
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_department_edit'}>
          <a
            style={styles.edit}
            onClick={this._showEditModal.bind(
              this,
              rowInfo.get('departmentId'),
              rowInfo.get('departmentName'),
              rowInfo.get('parentDepartmentId')
            )}
          >
            编辑
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'f_department_delete'}>
          <a
            onClick={this._delete.bind(
              this,
              rowInfo.get('departmentId'),
              rowInfo.get('employeeNum')
            )}
          >
            删除
          </a>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showLeadrModal = (
    departmentId: string,
    departmentName: string,
    parentDepartmentId: string,
    parentDepartmentIds: string,
    oldEmployeeId: string,
    oldEmployeeName: string,
    employeeNum: number
  ) => {
    if (employeeNum > 0) {
      const { showLeaderModal, allDepartments } = this.props.relaxProps;
      let departmentParentName = '';
      if (parentDepartmentId != '0') {
        let parentIds = parentDepartmentIds.split('|');
        for (let i = 1; i < parentIds.length; i++) {
          if (parentIds[i] != '0' && parentIds[i] != '') {
            const parent = allDepartments
              .filter((item) => item.get('departmentId') == parentIds[i])
              .get(0);
            departmentParentName = departmentParentName
              ? departmentParentName + '-' + parent.get('departmentName')
              : parent.get('departmentName');
          }
        }
      }

      departmentParentName = departmentParentName
        ? departmentParentName + '-' + departmentName
        : departmentName;

      parentDepartmentIds = parentDepartmentIds + departmentId + '|';

      let nodeDepartmentIds = allDepartments.filter((item) =>
        item.get('parentDepartmentIds').startsWith(parentDepartmentIds)
      );

      let department = Map({
        departmentId,
        departmentParentName,
        nodeDepartmentIds,
        oldEmployeeId,
        oldEmployeeName
      });
      showLeaderModal(department);
    } else {
      Modal.warning({
        title: '提示',
        content: '当前部门及子部门内未有员工，不可设置主管。',
        okText: '关闭'
      });
    }
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    departmentId: string,
    departmentName: string,
    parentDepartmentId: string
  ) => {
    const { showEditModal, allDepartments } = this.props.relaxProps;
    let departmentParentName = '';
    let departmentGrade = 0;
    if (parentDepartmentId != '0') {
      const parent = allDepartments
        .filter((item) => item.get('departmentId') === parentDepartmentId)
        .get(0);
      departmentParentName = parent.get('departmentName');
      departmentGrade = parent.get('departmentGrade');
    }
    let department = Map({
      departmentId,
      departmentName,
      departmentParentName,
      parentDepartmentId,
      departmentGrade
    });
    showEditModal(department, false);
  };

  /**
   * 删除
   */
  _delete = async (departmentId: number, employeeNum: number) => {
    if (employeeNum > 0) {
      Modal.warning({
        title: '提示',
        content: '当前部门及子部门内已有员工，不可删除。',
        okText: '关闭'
      });
    } else {
      this._confirm(departmentId);
    }
  };

  /**
   * 删除
   */
  _confirm = (departmentId: number) => {
    const { doDelete } = this.props.relaxProps;

    confirm({
      title: '提示',
      content: '删除当前部门，该部门下所有子部门也会删除，确定要删除？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        doDelete(departmentId);
      }
    });
  };

  /**
   * 添加子类目
   */
  _addChildrenCate = (
    parentDepartmentId: string,
    departmentParentName: string,
    departmentGrade: number
  ) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(
      Map({ parentDepartmentId, departmentParentName, departmentGrade }),
      true
    );
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (parentDepartmentIds, dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(parentDepartmentIds, dragIndex, hoverIndex);
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
    if (sourceCate.parentDepartmentId != targetCate.parentDepartmentId) {
      return;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(sourceCate.parentDepartmentIds, dragIndex, hoverIndex);
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

export default DragDropContext(HTML5Backend)(DepartmentList);
