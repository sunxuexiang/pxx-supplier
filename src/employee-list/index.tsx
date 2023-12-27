import React from 'react';
import { Row,Col,Button } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb,cache,AuthWrapper} from 'qmkit';
import List from './components/list';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import AppStore from './store';
import Form from 'antd/lib/form/Form';
import EmployeeModal from './components/employ-modal';
import OperateModal from './components/modal';
import EmployeeConnectModal from './components/employee-connect-modal';
import EmployeeAdjustModal from './components/employee-adjust-modal';
import DepartTree from './components/depart-tree';

const WrapperForm = Form.create()(SearchForm as any);
const ModalForm = Form.create()(OperateModal as any);
const EmployeeConnectForm = Form.create()(EmployeeConnectModal as any);
const EmployeeAdjustForm = Form.create()(EmployeeAdjustModal as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class EmployeeList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();        
  }

  render() {    
    //计算部门人数总和
    const totolEmployeeNum = this.store.state().get('countNum');
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>员工管理</Breadcrumb.Item>
          <Breadcrumb.Item>员工列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <AuthWrapper functionName="fetchEmploy">
        <div className="container">
          <Headline title="员工列表" />

          <WrapperForm ref={(form) => (window['_form'] = form)} />

          <ButtonGroup />

          <Row>
            <Col span={3}>
              <p style={Object.assign({ cursor: 'pointer' },this.state.click?{color:'#F56C1D'}:{})} 
              onClick={()=>this._showAll()}>{`全部部门  ${totolEmployeeNum}`}</p>
              { this.store.state().get('departTree').size>0 
              && this.store.state().get('defaultExpandedKeys').length>0 
              && <DepartTree/> }              
            </Col>     
            <Col span={1}></Col>
            <Col span={20}>                          
              <List />
            </Col>             
          </Row>

          <EmployeeModal />

          {/* 业务员交接弹框 */}
          <EmployeeConnectForm/>

          {/* 调整部门弹框 */}
          <EmployeeAdjustForm/>

          {/* 禁用弹框 */}
          <ModalForm />
        </div>
        </AuthWrapper>
      </div>
    );
  }

  _calculate=(list)=>{    
     return list.reduce((pre,current)=>{
       pre = pre + current.get('employeeNum')
       return pre;
     },this.store.state().get('restNum'))
  }

  _showAll=()=>{    
    this.setState({
      click:!this.state.click
    },()=>{
      this.store.toggleClick();
      if(this.state.click){   
        this.store.lastDepartmentIds(this.store.state().get('searchForm').get('departmentIds'));      
        this.store.onFormChange({
          field: 'departmentIds',
          value: []
        });   
      }else{
        this.store.onFormChange({
          field: 'departmentIds',
          value:this.store.state().get('lastDepartmentIds')
        });   
      }
    })
  }   
}
