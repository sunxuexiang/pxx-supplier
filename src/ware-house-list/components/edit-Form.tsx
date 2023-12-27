import React from 'react';
import { Form, Input, Radio, Select, Switch, TreeSelect } from 'antd';
import { AreaSelect, FindArea, ValidConst } from 'qmkit';
import { IMap } from 'typings/globalType';
import TextArea from 'antd/es/input/TextArea';
import { fromJS } from 'immutable';
import * as Enum from '@/marketing-add/common-components/marketing-enum';
import validate from '../../../web_modules/qmkit/validate';

const FormItem = Form.Item;
const Option = Select.Option;

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

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      editFormDataWareHouseType: Function;
    };
  };

  render() {
    const { formData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    console.log('====================================');
    console.log(formData.get('provinceId'),'111111');
    console.log('====================================');
    // const area = formData.get('provinceId')
    //   ? [
    //       formData.get('provinceId').toString(),
    //       formData.get('cityId') ? formData.get('cityId').toString() : null,
    //       formData.get('areaId') ? formData.get('areaId').toString() : null,
    //       formData.get('streetId') ? formData.get('streetId').toString() : null
    //     ]
    //   : [];
    // 默认不能被选
    const selectedAreas = formData.get('selectedAreas') || fromJS([]);
    // 已选的值
    const destinationArea = formData.get('destinationArea')
      ? formData.get('destinationArea').toJS()
      : [];

    // 在生成省市数据的时候通过传递的 已被选中的值就分离开 参数是否能被选择
    const treeData = FindArea.findProvinceCity(selectedAreas.toJS());

    // console.log(treeData)

    const tProps = {
      treeData,
      onChange: this._changeArea,
      treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: formData.get('wareId')
        ? formData
            .get('destinationAreaName')
            .toJS()
            .toString()
        : '请选择覆盖区域',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      disabled: false,
      style: {
        width: 350
      }
    };
    const lng = formData.get('lng') ? formData.get('lng').toString() : '';
    const lat = formData.get('lat') ? formData.get('lat').toString() : '';
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="仓库名称">
          {getFieldDecorator('wareName', {
            rules: [
              { required: true, whitespace: true, message: '请输入仓库名称' },
              { max: 20, message: '最多20字' }
            ],
            onChange: (e) => this._changeFormData('wareName', e.target.value),
            initialValue: formData.get('wareName')
          })(<Input placeholder="请输入仓库名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="仓库编码">
          {getFieldDecorator('wareCode', {
            rules: [
              { required: true, whitespace: true, message: '请输入仓库编码' },
              { max: 20, message: '最多20位数字或字母' },
              {
                pattern: /^[A-Za-z0-9]{1,20}$/,
                message: '最多20位数字或字母'
              }
            ],
            onChange: (e) => this._changeFormData('wareCode', e.target.value),
            initialValue: formData.get('wareCode')
          })(<Input placeholder="请输入仓库编码" disabled={true} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="仓库类型" hasFeedback>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择仓库类型'
              }
            ],
            onChange: (e) => this._changeFormData('type', e),
            initialValue: formData.get('type') == 0 ? '门店仓' : '线上仓'
          })(
            <Select disabled>
              <Option key="0" value="0">
                门店仓
              </Option>
              <Option key="1" value="1">
                线上仓
              </Option>
            </Select>
          )}
        </FormItem>

        {formData.get('type') == 1 && (
          <FormItem {...formItemLayout} label="覆盖区域">
            {getFieldDecorator('destinationArea', {
              initialValue: destinationArea,
              rules: [
                {
                  required: true,
                  message: '请选择覆盖区域'
                }
              ]
            })(
              <TreeSelect
                {...tProps}
                disabled={formData.get('type') == 0}
                filterTreeNode={(input, treeNode) =>
                  treeNode.props.title
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
            )}
          </FormItem>
        )}

        {formData.get('type') == 1 && (
          <>
            <FormItem {...formItemLayout} label="经度">
              {getFieldDecorator('lng', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入经度'
                  },
                  {
                    pattern: ValidConst.lng,
                    message: '请输入正确的经度'
                  }
                ],
                onChange: (e) => this._changeFormData('lng', e.target.value),
                initialValue: lng
              })(<Input placeholder="请输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="纬度">
              {getFieldDecorator('lat', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入纬度'
                  },
                  {
                    pattern: ValidConst.lat,
                    message: '请输入正确的纬度'
                  }
                ],
                onChange: (e) => this._changeFormData('lat', e.target.value),
                initialValue: lat
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="送货公里数(km)"
              hasFeedback
              required={true}
            >
              {getFieldDecorator('distance', {
                rules: [
                  { required: true, message: '请填写公里数' },
                  { pattern: validate.number, message: '请输入正确的公里数' }
                ],
                onChange: (e) =>
                  this._changeFormData('distance', e.target.value),
                initialValue: formData.get('distance')
              })(<Input size="large" />)}
            </FormItem>
          </>
        )}

        {formData.get('type') == 0 ? (
          <>
            <FormItem {...formItemLayout} label="是否支持自提">
              {getFieldDecorator('enabled', {
                initialValue: formData.get('pickUpFlag') == 1
              })(
                <Switch
                  defaultChecked={formData.get('pickUpFlag') == 1}
                  // checkedChildren="开"
                  // unCheckedChildren="关"
                  // checked={(formData.get('pickUpFlag')==1)}
                  onChange={(e) => {
                    this._editFormDataWareHouseType(e);
                    this.props.form.resetFields();
                  }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="自提地址">
              {getFieldDecorator('addressDetail', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入详细地址'
                  },
                  { max: 50, message: '最多50字' }
                ],
                onChange: (e) =>
                  this._changeFormData('addressDetail', e.target.value),
                initialValue: formData.get('addressDetail')
              })(<TextArea placeholder="请输入" maxLength={50} />)}
            </FormItem>
          </>
        ) : (
          <></>
        )}
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 修改表单字段
   */
  _editFormDataWareHouseType = (checked) => {
    const { editFormDataWareHouseType } = this.props.relaxProps;
    editFormDataWareHouseType(!checked ? 0 : 1);
  };

  /**
   * 不可选的日期
   */
  _disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  /**
   * 存储区域Id
   */
  _changeArea = (value, label) => {
    // console.log(JSON.stringify(value),'+++++++++++++>')
    // console.log(JSON.stringify(label),'----------->')
    let arrCity = FindArea.provinceCodeVOCityCode(value);
    let arrCityName = FindArea.provinceCodeVOCityName(value);
    const { editFormData } = this.props.relaxProps;
    editFormData({ key: 'destinationArea', value: arrCity });
    editFormData({ key: 'destinationAreaName', value: arrCityName });
  };
}
