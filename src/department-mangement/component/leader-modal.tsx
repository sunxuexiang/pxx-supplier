import * as React from 'react';
import { Modal, Form, AutoComplete, message } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const Option = AutoComplete.Option;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class LeaderModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(LeaderModalForm as any);
  }

  props: {
    relaxProps?: {
      leaderModalVisible: boolean;
      formData: IMap;
      newEmployeeId: string;
      filterCustomerData: IList;
      isAdd: boolean;
      modifyLeader: Function;
      editFormData: Function;
      leaderModal: Function;
      searchEmployee: Function;
      saveCustomerFilter: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    leaderModalVisible: 'leaderModalVisible',
    filterCustomerData: 'filterCustomerData',
    // 类目信息
    formData: 'formData',
    newEmployeeId: 'newEmployeeId',
    searchEmployee: noop,
    saveCustomerFilter: noop,
    // 添加数据
    modifyLeader: noop,
    // 修改数据
    editFormData: noop,
    // 关闭弹窗
    leaderModal: noop
  };

  render() {
    const { leaderModalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!leaderModalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title="设置主管"
        visible={leaderModalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        const { modifyLeader, newEmployeeId } = this.props.relaxProps;

        //提交
        if (newEmployeeId) {
          modifyLeader();
        } else {
          message.error('请选择主管！');
        }
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { leaderModal } = this.props.relaxProps;
    leaderModal();
  };
}

class LeaderModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      formData: IMap;
      filterCustomerData: IList;
      saveCustomerFilter: Function;
      searchEmployee: Function;
      closeModal: Function;
      editFormData: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      formData,
      searchEmployee,
      filterCustomerData,
      saveCustomerFilter
    } = this.props.relaxProps;
    const oldEmployeeName = formData.get('oldEmployeeName');
    const { getFieldDecorator } = this.props.form;

    const children = filterCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    return (
      <Form className="login-form">
        {formData.get('departmentParentName') ? (
          <FormItem {...formItemLayout} label="部门">
            {formData.get('departmentParentName')}
          </FormItem>
        ) : null}

        <FormItem {...formItemLayout} label="选择主管" hasFeedback>
          {getFieldDecorator('employeeId', {
            initialValue: oldEmployeeName,
            rules: [{ required: true, message: '请选择主管' }]
          })(
            <AutoComplete
              dataSource={[]}
              allowClear={true}
              value={oldEmployeeName}
              onChange={(value) => searchEmployee(value)}
              onSelect={(value) => saveCustomerFilter(value)}
            >
              {children as any}
            </AutoComplete>
          )}
        </FormItem>
      </Form>
    );
  }
}
