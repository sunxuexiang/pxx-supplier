import * as React from 'react';
import { Modal, Form, InputNumber, Tag } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 22,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class SortModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(SetSortModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      goodsInfo: any;
      onFieldChange: Function;
      switchShowModal: Function;
      setGoodsSeqNum: Function;
      goodsSeqNum: number;
      isBrandLinksort: any;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    goodsInfo: 'goodsInfo',
    goodsSeqNum: 'goodsSeqNum',
    isBrandLinksort: 'isBrandLinksort',
    onFieldChange: noop,
    switchShowModal: noop,
    setGoodsSeqNum: noop,
  };

  render() {
    const { modalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={'修改排序'}
        visible={modalVisible}
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
    const {
      switchShowModal,
      goodsInfo,
      setGoodsSeqNum,
      goodsSeqNum,
      isBrandLinksort
    } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        if (!(goodsInfo && goodsInfo.brandId)) {
          confirm({
            title: '提示',
            content: '该商品暂未关联品牌,您仍要设置这个商品排序吗？',
            onOk() {
              switchShowModal(false);
              setGoodsSeqNum(goodsInfo.goodsId, goodsSeqNum)
            }
          });
        } else if(!isBrandLinksort){
          confirm({
            title: '提示',
            content: '该品牌暂无排序,您仍要设置这个商品排序吗？',
            onOk() {
              switchShowModal(false);
              setGoodsSeqNum(goodsInfo.goodsId, goodsSeqNum)
            }
          });
        } else {
          setGoodsSeqNum(goodsInfo.goodsId, goodsSeqNum)
          switchShowModal(false);
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { switchShowModal } = this.props.relaxProps;
    switchShowModal(false);
  };
}

class SetSortModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      modalVisible: boolean;
      onFieldChange: Function;
      switchShowModal: Function;
      goodsSeqNum: number;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onFieldChange, goodsSeqNum } = this.props.relaxProps;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="品牌排序" hasFeedback>
          {getFieldDecorator('goodsSeqNum', {
            initialValue: goodsSeqNum,
            validateFirst: true,
            rules: [
              {
                validator: (_rule, value, callback) => {
                  if (999999 < value || value < 0 || value == null) {
                    callback('请输入0-999999');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <InputNumber
              min={0}
              precision={0}
              onChange={(value) => onFieldChange('goodsSeqNum', value)}
              style={{ width: '150px' }}
            />
          )}
        </FormItem>
        {goodsSeqNum == 0 && (
          <Tag style={{ marginLeft: 50 }} color="blue">
            若为0时，默认无序
          </Tag>
        )}
      </Form>
    );
  }
}
