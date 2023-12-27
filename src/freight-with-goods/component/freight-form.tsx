import React from 'react';
import { Form, Alert, Select } from 'antd';
import { FindArea } from 'qmkit';
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

export default class FreightForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { freightTempId, selectTemp } = this.props.relaxProps;
    const provinceId = selectTemp.get('provinceId')
      ? selectTemp.get('provinceId').toString()
      : '';
    const cityId = selectTemp.get('cityId')
      ? selectTemp.get('cityId').toString()
      : '';
    const areaId = selectTemp.get('areaId')
      ? selectTemp.get('areaId').toString()
      : '';
    const deliveryAddress = provinceId
      ? FindArea.addressInfo(provinceId, cityId, areaId)
      : '-';
    const express = this._freightExpress();
    return (
      <Form>
        <FormItem {...formItemLayout} label="运费模板">
          <div>
            {getFieldDecorator('freightTempId', {
              initialValue: freightTempId
                ? freightTempId.toString()
                : freightTempId,
              rules: [{ required: true, message: '请选择运费模板' }],
              onChange: this._editFreightTemp.bind(this, 'freightTempId')
            })(this._getFreightSelect())}
          </div>
          <div>
            {freightTempId && (
              <div style={{ paddingTop: 10 }}>
                <Alert
                  message={
                    <ul>
                      {(selectTemp.get('deliverWay') as number) == 1 ? (
                        <li>快递配送</li>
                      ) : null}
                      <li>
                        默认运费：{express}&nbsp;&nbsp;&nbsp;&nbsp;<a
                          style={{ textDecoration: 'none' }}
                          href={`/goods-freight-edit/${freightTempId}`}
                          target="view_window"
                        >
                          查看详情
                        </a>
                      </li>
                      <li>发货地：{deliveryAddress}</li>
                    </ul>
                  }
                />
              </div>
            )}
          </div>
        </FormItem>
      </Form>
    );
  }
  /**
   * 选中模板的值
   */
  _editFreightTemp = (_key: string, e) => {
    const { setFreightTempId, setGoodsFreight } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    setFreightTempId(e);
    setGoodsFreight(e, true);
  };
  /**
   * 提示框显示转换
   */
  _freightExpress = () => {
    const { selectTempExpress } = this.props.relaxProps;
    const {
      valuationType,
      freightStartNum,
      freightStartPrice,
      freightPlusNum,
      freightPlusPrice
    } = selectTempExpress.toJS();
    let express = '';
    if ((valuationType as number) == 0) {
      express =
        freightStartNum +
        '件内' +
        freightStartPrice +
        '元，' +
        '每增加' +
        freightPlusNum +
        '件，加' +
        freightPlusPrice +
        '元';
    } else if ((valuationType as number) == 1) {
      express =
        freightStartNum +
        'kg内' +
        freightStartPrice +
        '元，' +
        '每增加' +
        freightPlusNum +
        'kg，加' +
        freightPlusPrice +
        '元';
    } else if ((valuationType as number) == 2) {
      express =
        freightStartNum +
        'm³内' +
        freightStartPrice +
        '元，' +
        '每增加' +
        freightPlusNum +
        'm³，加' +
        freightPlusPrice +
        '元';
    }
    return express;
  };
  /**
   * select选中框
   */
  _getFreightSelect = () => {
    const { freightList } = this.props.relaxProps;
    return (
      <Select
        showSearch
        placeholder="请选择一个运费模板"
        notFoundContent="暂无运费模板"
      >
        {freightList.map((item) => {
          return (
            <Option
              key={item.get('freightTempId')}
              value={item.get('freightTempId') + ''}
            >
              {item.get('freightTempName')}
            </Option>
          );
        })}
      </Select>
    );
  };
}
