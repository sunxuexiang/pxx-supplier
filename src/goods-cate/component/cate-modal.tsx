import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, message, Icon } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, QMUpload, Const, Tips } from 'qmkit';
import { IMap } from 'typings/globalType';
import { Map } from 'immutable';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import '../goods-cate.less';

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

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(CateModalForm);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      doAdd: Function;
      editFormData: Function;
      formData: IMap;
      closeModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 类目信息
    formData: 'formData',
    // 关闭弹窗
    closeModal: noop
  };

  render() {
    const { modalVisible, formData } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={formData.get('storeCateId') ? '编辑' : '新增'}
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
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doAdd, formData } = this.props.relaxProps;
        if (formData.get('cateName')) {
          doAdd();
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      FILE_MAX_SIZE: 2 * 1024 * 1024
    };
  }

  componentDidMount() {
    const { form } = this.props;
    const { formData } = this.props.relaxProps;
    if (formData.get('cateImg')) {
      form.setFieldsValue({
        cateImg: {
          fileList: [
            {
              uid: formData.get('cateImg'),
              status: 'done',
              thumbUrl: formData.get('cateImg')
            }
          ]
        }
      });
    }
  }
  /**
   * 检查文件格式
   */
  checkUploadFile = (file, fileList) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= this.state.FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  editImages = (info) => {
    const { file } = info;
    console.warn(info);
    if (file.status === 'done') {
      if (
        file.response &&
        file.response.code &&
        file.response.code !== Const.SUCCESS_CODE
      ) {
        message.error('上传失败');
      } else {
        const store = this._store as any;

        message.success(`${file.name} 上传成功！`);
        // this.props.form.setFieldsValue({ cateImg: info.fileList });
        store.editFormData(Map({ cateImg: file.response[0] }));
      }
    }
  };
  render() {
    const formData = this._store.state().get('formData');
    const cateName = formData.get('cateName');
    console.warn(formData.toJS(), formData.get('cateParentId'));

    const {
      getFieldDecorator,
      setFieldsValue,
      getFieldValue
    } = this.props.form;
    const { editFormData } = this.props.relaxProps;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="分类名称" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              { max: 20, message: '最多20字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ],
            initialValue: cateName,
            onChange: this._changeCateName
          })(<Input />)}
        </FormItem>
        {/* {formData.get('cateParentId') && formData.get('cateParentId') !== 0 ? ( */}
        <FormItem {...formItemLayout} label="类目图片" hasFeedback>
          {getFieldDecorator('cateImg', {
            rules: [{ required: true, message: '请上传类目图片' }]
          })(
            <QMUpload
              name="uploadFile"
              onChange={this.editImages}
              listType="picture-card"
              fileList={
                getFieldValue('cateImg')
                  ? getFieldValue('cateImg').fileList
                  : []
              }
              action={
                Const.HOST +
                `/store/uploadStoreResource?cateId=${101}&resourceType=IMAGE`
              }
              accept={'.jpg,.jpeg,.png,.gif'}
              beforeUpload={this.checkUploadFile}
              onRemove={() => {
                setFieldsValue({ cateImg: '' });
                editFormData(Map({ cateImg: '' }));
              }}
            >
              {!formData.get('cateImg') && (
                <div className="goods-cate-img-upload">
                  <Icon type="plus" />
                </div>
              )}
            </QMUpload>
          )}
          <Tips title="建议尺寸:100*100px,大小不超过2M" />
        </FormItem>
        {/* ) : null} */}
        <FormItem {...formItemLayout} label="上级分类">
          {formData.get('cateParentName')
            ? formData.get('cateParentName')
            : '无'}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const store = this._store as any;
    store.editFormData(Map({ cateName: e.target.value }));
  };
}
