import React from 'react';
import { IMap, Relax } from 'plume2';

import { Form, Input, Button, Divider, message } from 'antd';
import { noop, ValidConst, AreaSelect, QMMethod } from 'qmkit';

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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

@Relax
export default class StepOne extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      onChange: Function; //改变商家基本信息
      onSaveStoreInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    onChange: noop,
    onSaveStoreInfo: noop
  };

  render() {
    const { company, onChange } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const { getFieldDecorator } = this.props.form;
    const area = storeInfo.get('provinceId')
      ? [
          storeInfo.get('provinceId').toString(),
          storeInfo.get('cityId') ? storeInfo.get('cityId').toString() : null,
          storeInfo.get('areaId') ? storeInfo.get('areaId').toString() : null
        ]
      : [];

    let returnArea = [];
    if (
      storeInfo.get('returnGoodsAddress') &&
      storeInfo.get('returnGoodsAddress').get('provinceId') &&
      storeInfo.get('returnGoodsAddress').get('cityId') &&
      storeInfo.get('returnGoodsAddress').get('areaId') &&
      storeInfo.get('returnGoodsAddress').get('townId')
    ) {
      returnArea = [
        storeInfo
          .get('returnGoodsAddress')
          .get('provinceId')
          .toString(),
        storeInfo
          .get('returnGoodsAddress')
          .get('cityId')
          .toString(),
        storeInfo
          .get('returnGoodsAddress')
          .get('areaId')
          .toString(),
        storeInfo
          .get('returnGoodsAddress')
          .get('townId')
          .toString()
      ];
    }

    return (
      <div>
        <div style={{ width: 520 }}>
          <Form>
            <FormItem {...formItemLayout} required={true} label="商户号">
              {getFieldDecorator('supplierCode', {
                initialValue: storeInfo.get('supplierCode')
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家性质">
              <Input
                disabled={true}
                value={
                  storeInfo.get('personId') === 2
                    ? '企事业单位'
                    : storeInfo.get('personId') === 1
                    ? '个体工商户'
                    : ''
                }
              />
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              {getFieldDecorator('supplierName', {
                initialValue: storeInfo.get('supplierName'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '商家名称',
                        1,
                        40
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="商家名称不得超过40字符"
                  onChange={(e: any) =>
                    onChange({
                      field: 'supplierName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              {getFieldDecorator('storeName', {
                initialValue: storeInfo.get('storeName'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '店铺名称',
                        1,
                        7
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="店铺名称不得超过7字符"
                  maxLength={7}
                  onChange={(e: any) =>
                    onChange({
                      field: 'storeName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              {getFieldDecorator('contactPerson', {
                initialValue: storeInfo.get('contactPerson'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系人',
                        2,
                        15
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入常用联系人姓名"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactPerson',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              {getFieldDecorator('contactMobile', {
                initialValue: storeInfo.get('contactMobile'),
                rules: [
                  { required: true, message: '请填写联系方式' },
                  {
                    pattern: ValidConst.phoneortele,
                    message: '请输入正确的联系方式'
                  }
                ]
              })(
                <Input
                  placeholder="请输入常用联系人11位手机号"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactMobile',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} required={true} label="联系邮箱">
              {getFieldDecorator('contactEmail', {
                initialValue: storeInfo.get('contactEmail'),
                rules: [
                  {
                    pattern: ValidConst.email,
                    message: '请输入正确的联系邮箱'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '联系邮箱',
                        1,
                        100
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入常用联系邮箱"
                  onChange={(e: any) =>
                    onChange({
                      field: 'contactEmail',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem> */}
            <FormItem {...formItemLayout} required={true} label="所在地区">
              {getFieldDecorator('area', {
                initialValue: area,
                rules: [{ required: true, message: '请选择所在地区' }]
              })(
                <AreaSelect
                  placeholder="请选择所在地区"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) =>
                    onChange({ field: 'area', value: value })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              {getFieldDecorator('addressDetail', {
                initialValue: storeInfo.get('addressDetail'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '详细地址',
                        1,
                        60
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入详细地址"
                  onChange={(e) =>
                    onChange({
                      field: 'addressDetail',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
            <Divider orientation="left">退货收件地址</Divider>
            <FormItem {...formItemLayout} required={true} label="收件人姓名">
              {getFieldDecorator('receiveName', {
                initialValue: storeInfo.get('receiveName'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '收件人姓名',
                        2,
                        15
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入收件人姓名"
                  onChange={(e: any) =>
                    onChange({
                      field: 'receiveName',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="收件人手机">
              {getFieldDecorator('receivePhone', {
                initialValue: storeInfo.get('receivePhone'),
                rules: [
                  { required: true, message: '请输入收件人手机' },
                  {
                    pattern: ValidConst.phone,
                    message: '请输入正确的收件人手机'
                  }
                ]
              })(
                <Input
                  placeholder="请输入收件人11位手机号"
                  onChange={(e: any) =>
                    onChange({
                      field: 'receivePhone',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="地址信息">
              {getFieldDecorator('returnArea', {
                initialValue: returnArea,
                rules: [{ required: true, message: '请选择退货地址' }]
              })(
                <AreaSelect
                  placeholder="请选择退货地址"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) =>
                    onChange({ field: 'returnArea', value: value })
                  }
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              {getFieldDecorator('detailAddress', {
                initialValue: storeInfo.get('detailAddress'),
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '详细地址',
                        1,
                        60
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="请输入详细地址"
                  onChange={(e) =>
                    onChange({
                      field: 'detailAddress',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this._onSave}>
                下一步
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 保存商家基本信息
   */
  _onSave = () => {
    const form = this.props.form;
    const { onSaveStoreInfo, company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        const {
          returnArea,
          receiveName,
          receivePhone,
          detailAddress,
          ...params
        } = company.get('storeInfo').toJS();
        if (returnArea.length === 0) {
          message.error('请选择退货地址信息');
          return;
        }
        const returnGoodsAddress = {
          receiveName,
          receivePhone,
          detailAddress
        };
        ['provinceId', 'cityId', 'areaId', 'townId'].forEach((key, index) => {
          returnGoodsAddress[key] = returnArea[index]
            ? Number(returnArea[index])
            : 0;
        });
        params.returnGoodsAddress = returnGoodsAddress;
        onSaveStoreInfo(params);
      } else {
        this.setState({});
      }
    });
  };
}
