import * as React from 'react';
import { Modal, Form, Select, Input, DatePicker, Icon, message } from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst, QMUpload, Tips, Const } from 'qmkit';
import { fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

const defaultMaxSize = 5 * 1024 * 1024;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

type myRelax = {
  detail: IMap;
  expressCompanyList: IList;
  changeVisible: boolean;
  loading: boolean;
  closeChangeModal: Function;
  updateLogistics: Function;
};

@Relax
export default class ChangeModal extends React.Component {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(LogisticsForm as any);
  }

  props: {
    relaxProps?: myRelax;
  };

  static relaxProps = {
    detail: 'detail',
    expressCompanyList: 'expressCompanyList',
    changeVisible: 'changeVisible',
    loading: 'loading',
    closeChangeModal: noop,
    updateLogistics: noop
  };

  render() {
    const { relaxProps } = this.props;
    const { changeVisible, closeChangeModal, loading } = relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <Modal
        maskClosable={false}
        title="修改运单号"
        visible={changeVisible}
        centered
        okText="提交"
        onOk={this._handleSubmit}
        onCancel={() => closeChangeModal()}
        confirmLoading={loading}
        width={650}
        destroyOnClose
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
    const { updateLogistics } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields((errs, values) => {
      if (!errs) {
        updateLogistics(values);
      }
    });
  };
}

class LogisticsForm extends React.Component<any, any> {
  props: {
    form;
    relaxProps?: {
      detail: IMap;
      expressCompanyList: IList;
    };
  };
  render() {
    const { form, relaxProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expressCompanyList, detail } = relaxProps;
    const expressCompany = getFieldValue('deliverId');
    const tradeDelivers = detail.get('tradeDelivers')
      ? detail.get('tradeDelivers').toJS()
      : [];
    const deliverWay = detail ? detail.toJS().deliverWay : '';
    let oldData = [] as any;
    if (tradeDelivers && tradeDelivers.length > 0) {
      oldData = tradeDelivers[0];
    }
    return (
      <Form {...formItemLayout}>
        {deliverWay !== 1 && deliverWay !== 8 && (
          <FormItem label="快递/物流公司">
            {getFieldDecorator('deliverId', {
              initialValue:
                oldData.logistics && oldData.logistics.logisticCompanyId
                  ? Number(oldData.logistics.logisticCompanyId)
                  : '',
              rules: [{ required: true, message: '请选择快递/物流公司' }]
            })(
              <Select>
                {expressCompanyList &&
                  (expressCompanyList || fromJS([])).toJS().map((item) => (
                    <Option
                      key={item.expressCompany.expressCompanyId}
                      value={item.expressCompany.expressCompanyId}
                    >
                      {item.expressCompany.expressName}
                    </Option>
                  ))}
                <Option value={-1}>其他</Option>
              </Select>
            )}
          </FormItem>
        )}
        {(deliverWay === 1 || deliverWay === 8) && (
          <FormItem label="快递/物流公司">
            {getFieldDecorator('deliverId', {
              initialValue:
                detail.getIn([
                  'logisticsCompanyInfo',
                  'logisticsCompanyName'
                ]) || ''
            })(<Input disabled />)}
          </FormItem>
        )}
        {expressCompany === -1 && deliverWay !== 1 && (
          <FormItem label="其他">
            {getFieldDecorator('otherCompany', {
              initialValue:
                oldData.logistics && oldData.logistics.logisticCompanyName
                  ? oldData.logistics.logisticCompanyName
                  : '',
              rules: [{ required: true, message: '请填写其他快递/物流公司' }]
            })(<Input />)}
          </FormItem>
        )}
        <FormItem label="快递/物流运单号">
          {getFieldDecorator('deliverNo', {
            initialValue:
              oldData.logistics && oldData.logistics.logisticNo
                ? oldData.logistics.logisticNo
                : '',
            rules: [{ required: true, message: '请填写运单号' }]
          })(<TextArea rows={3} />)}
        </FormItem>
        <FormItem label="快递/物流联系方式">
          {getFieldDecorator('logisticPhone', {
            initialValue:
              oldData.logistics && oldData.logistics.logisticPhone
                ? oldData.logistics.logisticPhone
                : '',
            rules: [
              { required: true, message: '快递/物流联系方式' },
              {
                pattern: ValidConst.phoneortele,
                message: '请输入正确的联系方式'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label="发货时间">
          {getFieldDecorator('deliverTime', {
            initialValue: oldData.deliverTime
              ? moment(oldData.deliverTime)
              : moment(new Date()),
            rules: [{ required: true, message: '请选择发货时间' }]
          })(
            <DatePicker
              showTime
              disabledDate={(current) =>
                current &&
                current > moment(oldData.deliverTime || new Date()).endOf('day')
              }
            />
          )}
        </FormItem>
        {(deliverWay === 1 || deliverWay === 8) && (
          <FormItem label="物流单图片">
            {getFieldDecorator('encloses', {
              initialValue: {
                fileList:
                  oldData.logistics && oldData.logistics.encloses
                    ? [
                        {
                          url: oldData.logistics.encloses,
                          response: [oldData.logistics.encloses],
                          uid: oldData.logistics.encloses
                        }
                      ]
                    : []
              }
            })(
              <QMUpload
                name={'uploadFile'}
                action={
                  Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
                }
                fileList={getFieldValue('encloses').fileList}
                listType={'picture-card'}
                disabled={
                  oldData.logistics && oldData.logistics.encloses ? true : false
                }
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile}
              >
                {getFieldValue('encloses') &&
                getFieldValue('encloses').fileList.length > 0 ? null : (
                  <Icon type="plus" />
                )}
              </QMUpload>
            )}
            <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且最大为5M，最多上传1张" />
          </FormItem>
        )}
      </Form>
    );
  }

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= defaultMaxSize) {
        return true;
      } else {
        message.error('文件大小不能超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}
