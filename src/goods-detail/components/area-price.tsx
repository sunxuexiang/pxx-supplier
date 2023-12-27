import * as React from 'react';
import { Checkbox, Form, Table } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';

const { Column } = Table;

@Relax
export default class AreaPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      levelDiscountFlag: boolean;
      areaPrice: IMap;
    };
  };

  static relaxProps = {
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
    return <WrapperForm {...relaxProps} />;
  }
}

class AreaPriceForm extends React.Component<any, any> {
  render() {
    const { levelDiscountFlag, areaPrice } = this.props;
    const areaPriceData = areaPrice
      .valueSeq()
      .toList()
      .toJS();
    return (
      <div>
        <div style={styles.bar}>
          <Form className="login-form" layout="inline">
            <div style={{ marginTop: 6, display: 'inline-block' }}>
              <Checkbox disabled checked={levelDiscountFlag}>
                叠加客户等级折扣
              </Checkbox>
            </div>

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
          </Form>
        </div>
      </div>
    );
  }
}

const styles = {
  bar: {
    padding: 10
  }
};
