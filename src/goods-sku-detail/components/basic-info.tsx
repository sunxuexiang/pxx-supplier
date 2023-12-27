import React from 'react';
import { Relax } from 'plume2';
import { Col, Form, Radio, Row } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { DataGrid, QMFloat } from 'qmkit';
import GoodsImage from '../../goods-detail/components/image';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Column } = DataGrid;

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
export default class BasicInfo extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      goods: IMap;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    goods: 'goods'
  };

  render() {
    const { goodsList, goods, goodsSpecs } = this.props.relaxProps;

    return (
      <div>
        <div style={{ marginTop: 20 }}>
          <h3>基本信息</h3>
          <Form style={{ marginTop: 20 }}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="门店价" required={true}>
                  <div>{QMFloat.addZero(goods.get('marketPrice'))}</div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="上下架" required={true}>
                  <RadioGroup disabled value={goods.get('addedFlag')}>
                    <Radio value={1}>上架</Radio>
                    <Radio value={0}>下架</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 20 }}>规格信息</h3>
          <DataGrid
            dataSource={goodsList.toJS()}
            pagination={false}
            rowKey="goodsInfoId"
          >
            <Column
              title="图片"
              dataIndex="goodsInfoImg"
              key="goodsInfoImg"
              render={(url) => {
                return (
                  <div className="smallCenter">
                    <GoodsImage url={url} />
                  </div>
                );
              }}
            />
            {goodsSpecs
              .map((item) => {
                return (
                  <Column
                    title={item.get('specName')}
                    dataIndex={'specId-' + item.get('specId')}
                    key={item.get('specId')}
                  />
                );
              })
              .toList()}
            <Column title="SKU编码" dataIndex="goodsInfoNo" key="goodsInfoNo" />
            <Column title="库存" dataIndex="stock" key="stock" />
            <Column
              align="center"
              title="条形码"
              dataIndex="goodsInfoBarcode"
              key="goodsInfoBarcode"
              render={(goodsInfoBarcode) =>
                goodsInfoBarcode ? goodsInfoBarcode : '-'
              }
            />
          </DataGrid>
        </div>
      </div>
    );
  }
}
