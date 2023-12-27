import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import AppStore from './store';
import DepartmentList from './component/department-list';
import DepartmentModal from './component/department-modal';
import Tool from './component/tool';
import LeaderModal from './component/leader-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title="部门管理" />
          <div style={{ marginBottom: 16 }}>
            <Alert
              message=""
              description={
                <div>
                  <p>初始化时可使用“批量创建”部门的方式导入；</p>
                  <p>支持同级部门间的拖拽排序；</p>
                  <p>
                    每个部门可设置一位主管，主管可看到并管理其部门以及子部门的员工，主管拥有其部门以及其子部门业务员的所有数据权限；
                  </p>
                </div>
              }
              type="info"
            />
          </div>

          <AuthWrapper functionName={'f_department_add_root'}>
            {/*工具条*/}
            <Tool />
          </AuthWrapper>

          <AuthWrapper functionName={'f_department_list'}>
            {/*列表*/}
            <DepartmentList />
          </AuthWrapper>

          {/*弹框*/}
          <DepartmentModal />

          <LeaderModal />
        </div>
      </div>
    );
  }
}
