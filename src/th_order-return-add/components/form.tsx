import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Select, Button, Icon, message } from 'antd';
import { fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, history, Tips, QMMethod, QMUpload } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

import GoodsList from './goods-list';
import RefundAmount from './refund-amount';

const formItemLayout = {
  labelCol: {
    sm: { span: 2 }
  } as any,
  wrapperCol: {
    sm: { span: 8 }
  } as any
};

const FILE_MAX_SIZE = 5 * 1024 * 1024;

/**
 * 退单form
 */
@Relax
export default class ReturnOrderForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      // 选中的退货原因
      selectedReturnReason: string;
      // 退货原因
      returnReasonList: IList;
      // 选中的退货方式
      selectedReturnWay: string;
      // 退货方式
      returnWayList: IList;
      // 退货说明
      description: any;
      // 附件信息
      images: any;
      editItem: Function;
      editImages: Function;
      add: Function;
      // 是否为退货
      isReturn: Boolean;
      tradeDetail: any;
    };
  };

  static relaxProps = {
    // 选中的退货原因
    selectedReturnReason: 'selectedReturnReason',
    // 退货原因
    returnReasonList: 'returnReasonList',
    // 选中的退货方式
    selectedReturnWay: 'selectedReturnWay',
    // 退货方式
    returnWayList: 'returnWayList',
    // 退货说明
    description: 'description',
    // 附件信息
    images: 'images',
    // 修改项
    editItem: noop,
    // 修改图片
    editImages: noop,
    // 提交
    add: noop,
    // 是否为退货
    isReturn: 'isReturn',
    tradeDetail: 'tradeDetail'
  };

  constructor(props) {
    super(props);
    this.state = {
      flushState: Math.random()
    };
  }

  render() {
    const {
      description,
      add,
      selectedReturnReason,
      selectedReturnWay,
      isReturn,
      tradeDetail
    } = this.props.relaxProps;
    console.log(isReturn,'isReturnisReturnisReturn');
    
    const { getFieldDecorator } = this.props.form;
    let images = this.props.relaxProps.images.toJS();
    let isNeed = false;
    if (tradeDetail.get('tradeState')) {
      isNeed = tradeDetail.get('tradeState').get('flowState') == 'COMPLETED';
    }
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>退单信息</h3>
        <Form>
          <FormItem {...formItemLayout} label="退单原因" hasFeedback>
            {getFieldDecorator('returnReason', {
              initialValue: selectedReturnReason,
              rules: [
                {
                  required: true,
                  message: '请选择退单原因'
                }
              ]
            })(this._getReturnReasonSelect())}
          </FormItem>
          {/* {isReturn ? ( */}
            <FormItem {...formItemLayout} label="退货方式" hasFeedback>
              {getFieldDecorator('returnWay', {
                initialValue: selectedReturnWay,
                rules: [
                  {
                    required: true,
                    message: '请选择退货方式'
                  }
                ]
              })(this._getReturnWaySelect())}
            </FormItem>
          {/* ) : null} */}

          <FormItem {...formItemLayout} label="退货说明" hasFeedback>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [
                {
                  required: true,
                  message: '退货说明不能为空'
                },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '退货说明',
                      1,
                      100
                    );
                  }
                }
              ]
            })(
              <Input.TextArea
                onChange={this._editInfo.bind(this, 'description')}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="附件信息">
            {getFieldDecorator('uploadFile', {
              initialValue: description,
              rules: [
                {
                  required: isNeed,
                  message: '请上传附件信息'
                }
              ]
            })(
              <div>
                <QMUpload
                  name="uploadFile"
                  style={styles.box}
                  onChange={this._editImages}
                  action={
                    Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
                  }
                  fileList={images}
                  listType={'picture-card'}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this._checkUploadFile}
                >
                  {images.length < 10 ? (
                    <Icon type="plus" style={styles.plus} />
                  ) : null}
                </QMUpload>
                <Tips title="请将您的退货凭据添加到附件,支持的图片格式：jpg、jpeg、png、gif，文件大小不超过5M,最多上传10张" />
              </div>
            )}
          </FormItem>

          {/* {isReturn ? ( */}
            <GoodsList
              form={this.props.form}
              flushState={this.state.flushState}
            />
          {/* ) : (
            <RefundAmount
              form={this.props.form}
              flushState={this.state.flushState}
            />
          )} */}
        </Form>
        <div className="bar-button">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            onClick={() => {
              this.props.form.validateFieldsAndScroll(null, (errs) => {
                //如果校验通过
                if (!errs) {
                  add();
                } else {
                  this.setState({
                    flushState: Math.random()
                  });
                }
              });
            }}
          >
            保存
          </Button>
          &nbsp;&nbsp;
          <Button
            size="large"
            onClick={() => {
              history.go(-1);
            }}
          >
            取消
          </Button>
        </div>
      </div>
    );
  }

  /**
   *  退货原因select
   */
  _getReturnReasonSelect = () => {
    const { returnReasonList } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择退货原因"
        notFoundContent="暂无退货原因"
        onChange={this._editInfo.bind(this, 'selectedReturnReason')}
      >
        <Option key={'key'} value={''}>
          请选择退单原因
        </Option>
        {returnReasonList.map((item) => {
          const map: IMap = item.toMap();
          const key = map.keySeq().first();
          const value = map.valueSeq().first();
          return (
            <Option key={key} value={key + ''}>
              {value + ''}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   *  退货方式select
   */
  _getReturnWaySelect = () => {
    const { returnWayList } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择退货方式"
        notFoundContent="暂无退货方式"
        onChange={this._editInfo.bind(this, 'selectedReturnWay')}
      >
        <Option key={'key'} value={''}>
          请选择退货方式
        </Option>
        {returnWayList.map((item) => {
          const map: IMap = item.toMap();
          const key = map.keySeq().first();
          const value = map.valueSeq().first();
          return (
            <Option key={key} value={key + ''}>
              {value + ''}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 修改
   */
  _editInfo = (key: string, e) => {
    const { editItem } = this.props.relaxProps;
    if (e.target) {
      e = e.target.value;
    }
    editItem(key, e);
  };

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }

    const { editImages } = this.props.relaxProps;
    editImages(fromJS(fileList));
  };

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
      if (file.size <= FILE_MAX_SIZE) {
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  } as any,

  avatar: {
    width: 150,
    height: 150
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  } as any,
  imgPlus: {
    width: 88,
    height: 88,
    border: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
