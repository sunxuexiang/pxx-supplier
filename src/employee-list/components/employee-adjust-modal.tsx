import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input,Alert,TreeSelect } from 'antd';
import { noop, QMMethod } from 'qmkit';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 18,
    xs: { span: 24 },
    sm: { span: 18 }
  }
};


@Relax
export default class EmployeeAdjustModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state={
      value:undefined
    }
  }

  props: {
    form: any;
    relaxProps?: {
      adjustmodalVisible: boolean;
      connectEmployee: string;
      employeeId: string;
      switchModal: Function;
      enterReason: Function;
      //禁用
      onDisable: Function;
      //批量禁用
      onBatchDisable: Function;
      toggleAdjustModal:Function;
      departTree:IList;
      setTargetDeparts:Function;
      departmentIds:any;
      ajustDepart:Function
    };
  };

  static relaxProps = {
    // 弹框是否显示
    adjustmodalVisible: 'adjustmodalVisible',
    connectEmployee: 'connectEmployee',
    employeeId: 'employeeId',
    // 关闭弹框
    switchModal: noop,
    // 输入原因
    enterReason: noop,
    //禁用
    onDisable: noop,
    //批量禁用
    onBatchDisable: noop,
    toggleAdjustModal:noop,
    departTree:'departTree',
    setTargetDeparts:noop,
    departmentIds:'departmentIds',
    ajustDepart:noop
  };

  render() {
    const {
      adjustmodalVisible,
      enterReason,
      connectEmployee,
      switchModal,
      toggleAdjustModal,
      departTree,
      departmentIds
    } = this.props.relaxProps;

    const { getFieldDecorator } = this.props.form;
    if (!adjustmodalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="调整部门"         
        visible={adjustmodalVisible}
        onCancel={() => toggleAdjustModal()}
        onOk={this._handleOk}
      >
        <Alert message="所属员工将归属于您设置的部门" 
        type="info"/>
        <Form>         
          <FormItem label="归属部门" required={true} style={{marginTop:16}} {...formItemLayout}>          
            {getFieldDecorator('connectEmployee', {
              initialValue: connectEmployee,
              rules: [
                { required: true, message: '请选择部门' },            
              ]
            })(     
              <TreeSelect
              showSearch={false}
              style={{ width: '100%' }}
            
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择部门"
              allowClear
              multiple
              treeDefaultExpandAll
              onChange={this.onChange}
            >
              {this._loop(departTree)}                 
            </TreeSelect>         
            )}            
          </FormItem>
        </Form>
      </Modal>
    );
  }

  _loop=(allDeparts)=>{     
    return allDeparts.map(dep=>{
      //子部门
      if(dep.get('children') && dep.get('children').size >0 ){
        const childDeparts = dep.get('children');
        return (
           <TreeNode value={dep.get('departmentId')}              
               title={dep.get('departmentName')}
            >             
              {this._loop(childDeparts)}
           </TreeNode>
        )
      }
      return (
        <TreeNode          
          value={dep.get('departmentId')}        
          title={dep.get('departmentName')}
        />
      );
    })
   }

   onChange=(ids,value)=>{          
     this.setState({value:value})
     //存放目标部门IDlist
     const { setTargetDeparts } = this.props.relaxProps;
     setTargetDeparts(ids)
   }

   _handleOk=()=>{
     const { departmentIds,ajustDepart } = this.props.relaxProps;
     if(departmentIds.length==0 || departmentIds.size==0){
        this.props.form.setFieldsValue({
          connectEmployee: {
            errors: [new Error('请选择部门')]
          }
        });        
     }else{
      ajustDepart();
     }
   }
}
