import * as React from 'react';
import {
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select
} from 'antd';
import { Relax, Store } from 'plume2';
import {
  Const,
  noop,
  QMMethod,
  QMUpload,
  Tips,
  UEditor,
  isSystem
} from 'qmkit';
import { IMap } from 'typings/globalType';
import { fromJS, Map } from 'immutable';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import ChooseCoupons from '../common-components/choose-coupons';
import ValidConst from '../../../web_modules/qmkit/validate';
import styled from 'styled-components';

const TableRow = styled.div`
  .ant-form-item-control {
    line-height: 1.15;
  }
`;

const rightsTypeData = fromJS([
  { id: 0, name: '等级徽章' },
  { id: 1, name: '专属客服' },
  { id: 2, name: '会员折扣' },
  { id: 3, name: '劵礼包' },
  { id: 5, name: '自定义' }
]);

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
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

const FILE_MAX_SIZE = 10 * 1024;
const Option = Select.Option;

@Relax
export default class EquitiesModal extends React.Component<any, any> {
  _store: Store;
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(CateModalForm as any);
  }
  props: {
    relaxProps?: {
      modalVisible: boolean;
      isAdd: boolean;
      modal: Function;
      formData: IMap;
      editFormData: Function;
      images: any;
      // 修改图片
      _editImages: Function;

      // 富文本
      context: string;
      imgType: number;
      setVisible: Function;
      refEditor: Function;
      regEditor: any;
      doAdd: Function;

      // 优惠券
      activity: any;
      onChosenCoupons: Function;
      onDelCoupon: Function;
      changeCouponTotalCount: Function;
      changeFormField: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    //是否是新增分类操作
    isAdd: 'isAdd',
    formData: 'formData',
    modal: noop, // 关闭弹窗
    editFormData: noop, //修改from表单数据
    images: 'images', // 附件信息
    _editImages: noop,
    // 富文本
    context: 'context',
    imgType: 'imgType',
    setVisible: noop,
    refEditor: noop,
    // regEditor:"regEditor",
    activity: 'activity',
    onChosenCoupons: noop,
    onDelCoupon: noop,
    changeCouponTotalCount: noop,
    changeFormField: noop,
    doAdd: noop
  };

  render() {
    const { modalVisible, isAdd } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={isAdd ? '新增' : '编辑'}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={isSystem(this._handleSubmit)}
        width={900}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal();
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.examine();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 校验一下
   */
  examine = () => {
    const { formData, activity, doAdd } = this.props.relaxProps;
    if (!formData.get('rightsLogo')) {
      message.error('请上传权益logo');
      return false;
    }
    if (formData.get('rightsType') == 3 && activity.get('coupons').size == 0) {
      message.error('请选择优惠券！');
      return false;
    }
    doAdd();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;
  props: {
    relaxProps?: {
      formData: IMap;
      images: any;

      editFormData: Function;
      _editImages: Function;
      useParentRateF: Function;
      // 富文本
      context: string;
      imgType: number;
      setVisible: Function;
      refEditor: Function;
      // regEditor:any;
      // 优惠券
      activity: any;
      onChosenCoupons: Function;
      onDelCoupon: Function;
      changeCouponTotalCount: Function;
      changeFormField: Function;
      doAdd: Function;
      isAdd: boolean;
    };

    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      formData,
      editFormData,
      activity,
      onChosenCoupons,
      context,
      imgType,
      changeCouponTotalCount,
      onDelCoupon,
      changeFormField,
      refEditor,
      setVisible,
      isAdd
    } = this.props.relaxProps;
    const { form } = this.props;

    const rightsName = formData.get('rightsName'); //等级名称
    const status = formData.get('status'); //启用开关
    const rightsType = formData.get('rightsType'); //权益类型
    const { getFieldDecorator } = this.props.form;
    let images = this.props.relaxProps.images;
    if (
      formData &&
      formData.get('rightsLogo') != null &&
      formData.get('rightsLogo') != ''
    ) {
      images = fromJS([
        {
          uid: 1,
          name: formData.get('rightsLogo'),
          size: 1,
          status: 'done',
          url: formData.get('rightsLogo')
        }
      ]);
    }
    images = images.toJS();
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="权益名称" hasFeedback>
          {getFieldDecorator('rightsName', {
            rules: [
              { required: true, whitespace: true, message: '请输入权益名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '权益名称');
                }
              }
            ],
            initialValue: rightsName,
            onChange: (e) => editFormData(Map({ rightsName: e.target.value }))
          })(<Input placeholder="请输入权益名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="权益类型">
          {getFieldDecorator('rightsType', {
            initialValue: rightsType,
            rules: [{ required: true, message: '请选择权益类型' }]
          })(
            <Select
              dropdownStyle={{ zIndex: 1053 }}
              disabled={!isAdd}
              onChange={(value) => {
                editFormData(Map({ rightsType: value }));
              }}
            >
              <Option value={null}>请选择</Option>
              {rightsTypeData.map((v) => (
                <Option key={v.get('id')} value={v.get('id')}>
                  {v.get('name')}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="权益logo" required={true}>
          <QMUpload
            style={styles.box}
            name="uploadFile"
            fileList={images}
            action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
            listType="picture-card"
            accept={'.png'}
            onChange={this.editImages}
            beforeUpload={this._checkUploadFile}
          >
            {images.length < 1 ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <div>
            <Tips title="移动端会员权益图标，会员获得该权益图标被点亮，最多可添加1张，仅限png，建议尺寸100*100 px，大小不超过10kb,请上传无背景透明图。" />
          </div>
        </FormItem>

        {rightsType == 3 && (
          <FormItem
            className="chooseNum"
            {...formItemLayout}
            label="发劵规则"
            required
          >
            <RadioGroup
              value={activity.get('receiveType')}
              onChange={async (e) => {
                await changeFormField({ receiveType: e.target.value });
                form.validateFields(['receiveCount'], { force: true });
              }}
            >
              <Radio value={0}>发放一次</Radio>
              &nbsp;&nbsp;&nbsp;
              <span>每月</span>
              <Radio value={1}>
                {getFieldDecorator('receiveCount', {
                  rules: [
                    {
                      required: activity.get('receiveType') == 1,
                      pattern: ValidConst.noZeroNineNumber,
                      message: '请输入1-30的整数'
                    }
                  ],
                  onChange: (val) => changeFormField({ receiveCount: val }),
                  initialValue: activity.get('receiveCount')
                })(
                  <InputNumber
                    min={1}
                    max={30}
                    disabled={activity.get('receiveType') != 1}
                  />
                )}
                <span>号发放</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        )}
        {rightsType == 3 && (
          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator(
              'coupons',
              {}
            )(
              <ChooseCoupons
                // type={99}
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) =>
                  changeCouponTotalCount(index, totalCount)
                }
              />
            )}
          </FormItem>
        )}
        <TableRow>
          <FormItem {...formItemLayout} label="权益介绍" required={true}>
            {getFieldDecorator(
              'equities',
              {}
            )(
              <UEditor
                key="equities"
                ref={(UEditor) => {
                  refEditor((UEditor && UEditor.editor) || {});
                }}
                id="equities"
                height="640"
                content={context}
                insertImg={() => setVisible(1, 2)}
                chooseImgs={[]}
                imgType={imgType}
                maximumWords={500}
              />
            )}
          </FormItem>
        </TableRow>

        <FormItem label="启用状态" {...formItemLayout}>
          <RadioGroup
            onChange={(value) =>
              editFormData(Map({ status: value.target.value }))
            }
            value={status}
          >
            <Radio value={1}>开启</Radio>
            <Radio value={0}>关闭</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    );
  }

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：png
    if (fileName.endsWith('.png')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过10KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };

  /**
   * 改变图片
   */
  editImages = ({ file, fileList }) => {
    if (file.status == 'error' || fileList == null) {
      message.error('上传失败');
      return;
    }
    const { _editImages, editFormData } = this.props.relaxProps;

    //删除图片
    if (file.status == 'removed') {
      editFormData(Map({ rightsLogo: '' }));
      _editImages(fromJS([]));
      return;
    }

    fileList = fileList.filter((item) => item != null);
    if (fileList[0].status == 'done') {
      editFormData(Map({ rightsLogo: fileList[0].response[0] }));
    }
    _editImages(fromJS(fileList));
  };

  /**
   * 修改分类名称
   */
  _changeCateName = (e, type) => {
    console.log('type===>', type);
    const { editFormData } = this.props.relaxProps;
    editFormData(Map({ cateName: e.target.value }));
  };
}

const styles = {
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
