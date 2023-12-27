import * as React from 'react';
import { Checkbox, Form, Table } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { QMFloat } from 'qmkit';

const { Column } = Table;

@Relax
export default class AreaPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      marketPrice: number;
      levelDiscountFlag: boolean;
      areaPrice: IMap;
    };
  };

  static relaxProps = {
    marketPrice: 'marketPrice',
    // 是否叠加客户等级折扣
    levelDiscountFlag: 'levelDiscountFlag',
    // 区间价map
    areaPrice: 'areaPrice'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(AreaPriceForm as any);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return <WrapperForm {...{ relaxProps: relaxProps }} />;
  }
}

class AreaPriceForm extends React.Component<any, any> {
  render() {
    const { levelDiscountFlag, areaPrice, marketPrice } = this.props.relaxProps;
    const areaPriceData = areaPrice
      .valueSeq()
      .toList()
      .toJS();
    return (
      <div>
        <Form className="login-form" layout="inline">
          <div
            style={{ marginTop: 20, marginBottom: 20, display: 'inline-block' }}
          >
            <span>
              SKU门店价：
              <strong style={{ color: '#333333' }}>
                {QMFloat.addZero(marketPrice)}
              </strong>
            </span>
            <Checkbox
              style={{ marginLeft: 15 }}
              disabled={true}
              checked={levelDiscountFlag}
            >
              叠加客户等级折扣
            </Checkbox>
          </div>
        </Form>

        {/*区间价价table*/}
        <Table
          style={{ paddingTop: '10px' }}
          dataSource={areaPriceData}
          pagination={false}
          rowKey="intervalPriceId"
        >
          <Column
            title={'订货区间'}
            key="area"
            width={80}
            render={(rowInfo) => {
              return (
                <div>
                  <span>≥</span>
                  <span>{rowInfo.count}</span>
                </div>
              );
            }}
          />
          <Column
            title={'订货价'}
            key="price"
            width={80}
            render={(rowInfo) => {
              return <div>{rowInfo.price}</div>;
            }}
          />
        </Table>
      </div>
    );
  }
}
