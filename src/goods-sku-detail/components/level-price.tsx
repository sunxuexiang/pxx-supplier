import * as React from 'react';
import { Checkbox, Form, Table } from 'antd';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { QMFloat } from 'qmkit';

import UserPrice from './user-price';

const { Column } = Table;
@Relax
export default class LevelPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      marketPrice: number;
      costPrice: number;
      openUserPrice: boolean;
      userLevelList: IList;
      userLevelPrice: IMap;
      //起订量同步
      levelCountChecked: boolean;
      levelCountDisable: boolean;
      //限订量同步
      levelMaxCountChecked: boolean;
      levelMaxCountDisable: boolean;
    };
  };

  static relaxProps = {
    marketPrice: 'marketPrice',
    costPrice: 'costPrice',
    // 是否开启按客户单独定价
    openUserPrice: 'openUserPrice',
    // 级别列表
    userLevelList: 'userLevelList',
    // 级别价格数据
    userLevelPrice: 'userLevelPrice',
    //起订量同步
    levelCountChecked: 'levelCountChecked',
    levelCountDisable: 'levelCountDisable',
    //限订量同步
    levelMaxCountChecked: 'levelMaxCountChecked',
    levelMaxCountDisable: 'levelMaxCountDisable'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(LevelPriceForm as any);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return <WrapperForm {...{ relaxProps: relaxProps }} />;
  }
}

class LevelPriceForm extends React.Component<any, any> {
  render() {
    const {
      marketPrice,
      openUserPrice,
      userLevelList,
      userLevelPrice
    } = this.props.relaxProps;
    return (
      <div>
        <div style={{ paddingBottom: 20 }}>
          <Form className="login-form" layout="inline">
            <div style={{ marginTop: 20, display: 'inline-block' }}>
              <span>
                SKU门店价：
                <strong style={{ color: '#333333' }}>
                  {QMFloat.addZero(marketPrice)}
                </strong>
              </span>
              <Checkbox
                style={{ marginLeft: 15 }}
                disabled={true}
                checked={openUserPrice}
              >
                按客户单独定价
              </Checkbox>
            </div>
          </Form>
        </div>
        {/*级别价table*/}
        <Table
          dataSource={userLevelList.toJS()}
          pagination={false}
          rowKey="customerLevelId"
          scroll={{ y: 300 }}
        >
          <Column
            width="15%"
            title="级别"
            key="customerLevelName"
            dataIndex="customerLevelName"
          />
          <Column
            width="10%"
            key="customerLevelDiscount"
            title={'默认折扣价'}
            render={(rowInfo) => (
              <div>
                <div>
                  ¥{(marketPrice * rowInfo.customerLevelDiscount).toFixed(2)}
                </div>
                <div>
                  {(rowInfo.customerLevelDiscount * 100).toFixed(0) + '%'}
                </div>
              </div>
            )}
          />
          <Column
            title={'自定义订货价'}
            key="price"
            width="25%"
            render={(rowInfo) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <div>
                  {(userLevelPrice.get(levelId) &&
                    userLevelPrice.get(levelId).get('price')) ||
                    '-'}
                </div>
              );
            }}
          />
          <Column
            title={'起订量'}
            key="count"
            width="25%"
            render={(rowInfo) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <div>
                  {userLevelPrice.get(levelId)
                    ? userLevelPrice.get(levelId).get('count') || '-'
                    : '-'}
                </div>
              );
            }}
          />
          <Column
            title={'限订量'}
            key="maxCount"
            width="25%"
            render={(rowInfo) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <div>
                  {userLevelPrice.get(levelId)
                    ? userLevelPrice.get(levelId).get('maxCount') || '-'
                    : '-'}
                </div>
              );
            }}
          />
        </Table>

        {openUserPrice ? <UserPrice /> : null}
      </div>
    );
  }
}
