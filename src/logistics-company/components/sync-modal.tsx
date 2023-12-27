import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Select, Checkbox, Row, Radio, Alert } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};
@Relax
export default class SyncModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      syncVisible: boolean;
      syncType: number;
      onSyncSave: Function;
      closeSyncModal: Function;
      storeList: IList;
      loading: boolean;
    };
  };

  static relaxProps = {
    syncVisible: 'syncVisible',
    syncType: 'syncType',
    storeList: 'storeList',
    loading: 'loading',
    onSyncSave: noop,
    closeSyncModal: noop
  };

  render() {
    const { syncVisible, loading } = this.props.relaxProps;
    return (
      <Modal
        title="同步设置"
        width={600}
        maskClosable={false}
        visible={syncVisible}
        onCancel={this._onCancel}
        onOk={this._onOk}
        confirmLoading={loading}
        destroyOnClose
      >
        <Alert
          message=""
          description={
            <div>
              <p>操作说明</p>
              <p>1、该配置功能是实现多商家统一配置的便捷功能</p>
              <p>
                2、若未选择需要同步该设置的商家，那么该设置是不对任何商家生效
              </p>
              <p>
                3、选择多个商家，保存后，系统则将该规则设置与物流公司信息自动同步所选的商家
              </p>
            </div>
          }
          type="info"
        />
        <EditFormWrapper
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交表单
   */
  _onOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        //无任何表单验证错误,则提交
        const { onSyncSave } = this.props.relaxProps;
        onSyncSave(values);
      }
    });
  };

  /**
   * 关闭弹框
   */
  _onCancel = () => {
    const { closeSyncModal } = this.props.relaxProps;
    closeSyncModal();
  };
}

class SyncForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      syncVisible: boolean;
      syncType: number;
      onSyncSave: Function;
      closeSyncModal: Function;
      storeList: IList;
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      checkAll: false,
      indeterminate: false
    };
  }

  onCheckAllChange = (e) => {
    const { form } = this.props;
    const { storeList } = this.props.relaxProps;
    let storeIds = [];
    if (e.target.checked) {
      storeIds = storeList.toJS().map((item) => item.storeId);
    }
    this.setState({
      checkAll: e.target.checked,
      indeterminate: false
    });
    form.setFieldsValue({ storeIds });
  };

  storeChange = (value) => {
    const { storeList } = this.props.relaxProps;
    let checkAll = false;
    let indeterminate = false;
    if (value.length === storeList.toJS().length) {
      checkAll = true;
    } else if (value.length > 0) {
      indeterminate = true;
    }
    this.setState({ checkAll, indeterminate });
  };

  render() {
    const { indeterminate, checkAll } = this.state;
    const { syncType, storeList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    console.log(storeList.toJS(), 'storeList');
    return (
      <div>
        <Form layout="inline" style={{ marginTop: '16px' }}>
          {syncType === 2 && (
            <Row>
              <FormItem>
                {getFieldDecorator('exportType', {
                  rules: [
                    { required: true, message: '请选择需要同步的物流公司' }
                  ],
                  initialValue: '1'
                })(
                  <Radio.Group>
                    <Radio value="1">同步所有物流公司</Radio>
                    <Radio value="2">同步新增选中物流公司</Radio>
                    <Radio value="3">同步删除选中物流公司</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Row>
          )}
          <Row>
            <Checkbox
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={checkAll}
            >
              全选
            </Checkbox>
          </Row>
          <Row>
            <FormItem label="需要同步的商家">
              {getFieldDecorator('storeIds', {
                rules: [{ required: true, message: '请选择需要同步的商家' }]
              })(
                <Select
                  style={{ width: 410 }}
                  showSearch
                  mode="multiple"
                  maxTagCount={3}
                  maxTagTextLength={6}
                  filterOption={(input, option: any) =>
                    option.props.children.indexOf(input) >= 0
                  }
                  onChange={this.storeChange}
                >
                  {storeList.map((item) => {
                    return (
                      <Option
                        key={item.get('storeId')}
                        value={item.get('storeId')}
                      >
                        {item.get('storeName')}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}

const EditFormWrapper = Form.create()(SyncForm) as any;
