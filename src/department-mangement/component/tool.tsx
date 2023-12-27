import * as React from 'react';
import { Link } from 'react-router-dom';
import { Relax, IMap } from 'plume2';
import { Map } from 'immutable';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      departments: IMap;

      modal: Function;
      showEditModal: Function;
    };
  };

  static relaxProps = {
    // 父子结构的平台分类
    departments: 'departments',

    // 展示关闭弹框
    modal: noop,
    showEditModal: noop
  };

  render() {
    const { departments } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <Button type="primary" onClick={this._showCateModal}>
          新增一级部门
        </Button>
        {departments.count() === 0 ? (
          <Link to="/department-import">
            <Button type="primary">批量创建部门</Button>
          </Link>
        ) : (
          <Button disabled={true} type="primary">
            批量创建部门
          </Button>
        )}
      </div>
    );
  }

  /**
   * 显示一级分类弹框
   */
  _showCateModal = () => {
    const { showEditModal } = this.props.relaxProps;
    let departmentName = '';
    let parentDepartmentId = '';
    let departmentId = '';
    let department = Map({
      departmentId,
      departmentName,
      parentDepartmentId
    });
    showEditModal(department, true);
  };
}
