import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input,Alert,AutoComplete } from 'antd';
import { noop, QMMethod } from 'qmkit';
import { IList } from 'typings/globalType';
import { message } from 'antd';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

@Relax
export default class EmployeeConnectModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      connectmodalVisible: boolean;      
      employeeId: string;
      switchModal: Function;
      enterReason: Function;
      //禁用
      onDisable: Function;
      //批量禁用
      onBatchDisable: Function;
      toggleConnectModal:Function;
      searchEmployees:Function;
      filterEmployeeData:IList;
      saveConnectEmployee:Function;
      targetEmployeeId:string;
      connectEmployee:Function;
      searchText:string
    };
  };

  static relaxProps = {
    // 弹框是否显示
    connectmodalVisible: 'connectmodalVisible',    
    employeeId: 'employeeId',
    // 关闭弹框
    switchModal: noop,
    // 输入原因
    enterReason: noop,
    //禁用
    onDisable: noop,
    //批量禁用
    onBatchDisable: noop,
    toggleConnectModal:noop,
    searchEmployees:noop,
    filterEmployeeData:'filterEmployeeData',
    saveConnectEmployee:noop,
    targetEmployeeId:'targetEmployeeId',
    connectEmployee:noop,
    searchText:'searchText'
  };

  render() {
    const {
      connectmodalVisible,      
      targetEmployeeId,      
      toggleConnectModal,
      searchEmployees,
      filterEmployeeData,
      saveConnectEmployee, 
      searchText     
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    
    const children = filterEmployeeData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));
    if (!connectmodalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="业务员交接"
         
        visible={connectmodalVisible}
        onCancel={() => toggleConnectModal()}
        onOk={this._handleOk}
      >
        <Alert message="将该业务员客户交接给其他业务员管理，交接后，新的业务员可以看到新客户的全部数据。" 
        type="info"/>
        <Form layout="inline">
          <FormItem label="接手业务员" style={{marginTop:16}}>             
            {getFieldDecorator('searchText', {
              initialValue: searchText,        
              rules: [
                { required: true, message: '请选择业务员' },           
              ]                  
            })(
              <AutoComplete
              style={{flex:1}}
              dataSource={[]}
              allowClear={true}
              value={searchText}
              onChange={(value) => searchEmployees(value)}
              onSelect={(value) => saveConnectEmployee(value)}
              >
            {children as any}
          </AutoComplete>    
            )}            
          </FormItem>
        </Form>
      </Modal>
    );
  }

  /**
   * 确定按钮
   */
  _handleOk = () => {
    const { targetEmployeeId,connectEmployee } = this.props.relaxProps;
    const form = this.props.form;
  
    // 账号禁用
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {        
        //批量禁用
        if (targetEmployeeId != '') {
          connectEmployee();
        }else{
          message.error('请选择业务员');         
        }
      } else {
        this.setState({});
      }
    });
  };
}
