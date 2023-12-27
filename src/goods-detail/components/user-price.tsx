import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Row, Col, Form } from 'antd';
import { IList, IMap } from 'typings/globalType';

const { Column } = Table;

@Relax
export default class UserPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      userList: IList;
      userPrice: IMap;
      //客户起订量同步
      userCountChecked: boolean;
      userCountDisable: boolean;
      //客户限订量同步
      userMaxCountChecked: boolean;
      userMaxCountDisable: boolean;
    };
  };

  static relaxProps = {
    // 用户列表
    userList: 'userList',
    // 用户价格Map
    userPrice: 'userPrice',
    //客户起订量同步
    userCountChecked: 'userCountChecked',
    userCountDisable: 'userCountDisable',
    //客户起订量同步
    userMaxCountChecked: 'userMaxCountChecked',
    userMaxCountDisable: 'userMaxCountDisable'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(UserPriceForm as any);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return <WrapperForm {...{ relaxProps: relaxProps }} />;
  }
}

class UserPriceForm extends React.Component<any, any> {
  render() {
    const { userPrice } = this.props.relaxProps;
    const userPriceData = userPrice
      .valueSeq()
      .toList()
      .toJS();
    return (
      <div style={{ marginTop: 10 }}>
        <Row>
          <Col>
            {/*用户价格table*/}
            <div>
              <Table
                dataSource={userPriceData}
                pagination={false}
                scroll={{ y: 298 }}
                rowKey="customerId"
              >
                <Column
                  title="客户名称"
                  key="userName"
                  dataIndex="userName"
                  width="30%"
                />
                <Column
                  title="客户级别"
                  key="userLevelName"
                  dataIndex="userLevelName"
                  width="10%"
                />
                <Column
                  title={'订货价'}
                  key="price"
                  width={80}
                  render={(rowInfo) => <div>{rowInfo.price}</div>}
                />
                <Column
                  title={'起订量'}
                  key="count"
                  width={80}
                  render={(rowInfo) => <div>{rowInfo.count || '-'}</div>}
                />
                <Column
                  title={'限订量'}
                  key="maxCount"
                  width={80}
                  render={(rowInfo) => <div>{rowInfo.maxCount || '-'}</div>}
                />
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
