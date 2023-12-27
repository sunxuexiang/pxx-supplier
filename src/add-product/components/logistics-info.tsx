import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import { Card, Form, Input, Select, Row, Col, message } from 'antd';
import '../add-product.less';
import { getFreightList } from '../webapi';

const LogisticsInfo = forwardRef((props: any, ref) => {
  const { getFieldDecorator } = props.form;
  const [freightData, setFreightData] = useState([]);
  const [info, setInfo] = useState({} as any);

  useImperativeHandle(ref, () => ({
    logisticsInfoSubmit
  }));
  useEffect(() => {
    getFreightData();
  }, []);
  useEffect(() => {
    if (props.openEdit) {
      setInfo({ ...props.goodsDetail.goods });
    }
  }, [props.goodsDetail]);
  // 获取运费模板
  const getFreightData = () => {
    getFreightList().then((data) => {
      console.warn(data, '运费模板');
      setFreightData(data.res.context);
    });
  };
  // 物流信息提交
  const logisticsInfoSubmit = async () => {
    const info = await props.form.validateFieldsAndScroll();
    if (info.errors) {
      message.error('请填写正确的商品物流信息');
      return false;
    } else {
      const { freightTempId, goodsCubage, goodsWeight } = info;
      const data = {
        freightTempId
        // goodsCubage: Number(goodsCubage),
        // goodsWeight: Number(goodsWeight)
      };
      return data;
    }
  };
  return (
    <div className="new-product-card">
      <Card title="物流信息" headStyle={{ color: '#F56C1D' }} bordered={false}>
        <Form
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 18
          }}
          autoComplete="off"
        >
          <Row type="flex">
            <Col span={10}>
              <Form.Item label="运费模板">
                {getFieldDecorator('freightTempId', {
                  rules: [{ required: true, message: '请选择运费模板' }],
                  initialValue: props.openEdit ? info.freightTempId : ''
                })(
                  <Select
                    style={{ width: '70%' }}
                    showSearch
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    placeholder="请选择一个运费模板"
                    notFoundContent="暂无运费模板"
                  >
                    {freightData.map((item) => {
                      return (
                        <Select.Option
                          key={item.freightTempId}
                          value={item.freightTempId}
                        >
                          {item.freightTempName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {/* <Col span={10}>
              <Form.Item label="物流重量">
                {getFieldDecorator('goodsWeight', {
                  initialValue: props.openEdit ? info.goodsWeight : '',
                  rules: [
                    { required: true, message: '请输入物流重量' },
                    {
                      pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,2})?$)/,
                      message: '请填写三位小数的合法数字'
                    },
                    {
                      type: 'number',
                      min: 0.001,
                      message: '最小值为0.001',
                      transform: function (value) {
                        return isNaN(parseFloat(value))
                          ? 0.001
                          : parseFloat(value);
                      }
                    },
                    {
                      type: 'number',
                      max: 9999.999,
                      message: '最大值为9999.999',
                      transform: function (value) {
                        return isNaN(parseFloat(value))
                          ? 0.001
                          : parseFloat(value);
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: '70%' }}
                    type="number"
                    addonAfter={'kg'}
                    placeholder="请输入物流重量"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="物流体积">
                {getFieldDecorator('goodsCubage', {
                  initialValue:
                    props.openEdit && info.goodsCubage && info.goodsCubage > 0
                      ? info.goodsCubage
                      : '',
                  rules: [
                    {
                      pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,5})?$)/,
                      message: '请填写六位小数的合法数字'
                    },
                    {
                      type: 'number',
                      min: 0.000001,
                      message: '最小值为0.000001',
                      transform: function (value) {
                        return isNaN(parseFloat(value))
                          ? 0.000001
                          : parseFloat(value);
                      }
                    },
                    {
                      type: 'number',
                      max: 999.999999,
                      message: '最大值为999.999999',
                      transform: function (value) {
                        return isNaN(parseFloat(value))
                          ? 0.000001
                          : parseFloat(value);
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: '70%' }}
                    type="number"
                    addonAfter={'m³'}
                    placeholder="请输入物流体积"
                  />
                )}
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Card>
    </div>
  );
});

const LogisticsInfoTemplate = Form.create()(LogisticsInfo);

export default LogisticsInfoTemplate;
