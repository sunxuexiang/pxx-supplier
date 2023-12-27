import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Divider } from 'antd';
import { FindArea } from 'qmkit';

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
export default class StepOne extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    //拼接地址
    const area = FindArea.addressInfo(
      storeInfo.get('provinceId'),
      storeInfo.get('cityId'),
      storeInfo.get('areaId')
    );
    let returnArea = '';
    if (storeInfo.get('returnGoodsAddress')) {
      returnArea = FindArea.addressStreetInfo(
        storeInfo.get('returnGoodsAddress').get('provinceId'),
        storeInfo.get('returnGoodsAddress').get('cityId'),
        storeInfo.get('returnGoodsAddress').get('areaId'),
        storeInfo.get('returnGoodsAddress').get('townId')
      );
    }
    return (
      <div>
        <div style={{ width: 520 }}>
          <Form>
            <FormItem {...formItemLayout} required={true} label="商户号">
              <p style={{ color: '#333' }}>{storeInfo.get('supplierCode')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家账号">
              <p style={{ color: '#333' }}>{storeInfo.get('accountName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家性质">
              <p style={{ color: '#333' }}>
                {storeInfo.get('personId') === 2
                  ? '企事业单位'
                  : storeInfo.get('personId') === 1
                  ? '个体工商户'
                  : ''}
              </p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              <p style={{ color: '#333' }}>{storeInfo.get('supplierName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              <p style={{ color: '#333' }}>{storeInfo.get('storeName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              <p style={{ color: '#333' }}>{storeInfo.get('contactPerson')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              <p style={{ color: '#333' }}>{storeInfo.get('contactMobile')}</p>
            </FormItem>
            {/* <FormItem {...formItemLayout} required={true} label="联系邮箱">
              <p style={{ color: '#333' }}>{storeInfo.get('contactEmail')}</p>
            </FormItem> */}
            <FormItem {...formItemLayout} required={true} label="所在地区">
              <p style={{ color: '#333' }}>{area}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              <p style={{ color: '#333' }}>{storeInfo.get('addressDetail')}</p>
            </FormItem>

            <Divider orientation="left">退货收件地址</Divider>
            <FormItem {...formItemLayout} required={true} label="收件人姓名">
              <p style={{ color: '#333' }}>{storeInfo.get('receiveName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="收件人手机">
              <p style={{ color: '#333' }}>{storeInfo.get('receivePhone')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="地址信息">
              <p style={{ color: '#333' }}>{returnArea}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              <p style={{ color: '#333' }}>{storeInfo.get('detailAddress')}</p>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
