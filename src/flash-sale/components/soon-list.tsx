import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import moment from 'moment';
import { IList } from 'typings/globalType';
import { AuthWrapper, history } from 'qmkit';

@Relax
export default class SoonList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList'
  };

  render() {
    const { loading, dataList } = this.props.relaxProps;
    return (
      <Table
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={false}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'activityDate',
      dataIndex: 'activityDate',
      title: '活动日期'
    },
    {
      key: 'activityTime',
      dataIndex: 'activityTime',
      title: '场次'
    },
    {
      key: 'goodsNum',
      dataIndex: 'goodsNum',
      title: '抢购商品数量'
    },
    {
      key: 'option',
      title: '操作',
      width: '82px',
      render: (record) => this._option(record)
    }
  ];

  _option = (record) => {
    if (
      moment()
        .add(1, 'h')
        .isAfter(moment(record.activityFullTime))
    ) {
      return (
        <div>
          <AuthWrapper functionName={'f_flash_sale_goods_list'}>
            <a
              href="javascript:;"
              onClick={() => {
                history.push({
                  pathname: `/flash-sale-goods-list/${record.activityDate}/${
                    record.activityTime
                  }`
                });
              }}
            >
              查看
            </a>
          </AuthWrapper>
        </div>
      );
    } else {
      return (
        <div>
          <AuthWrapper functionName={'f_flash_sale_goods_list'}>
            <a
              href="javascript:;"
              onClick={() => {
                history.push({
                  pathname: `/flash-sale-goods-list/${record.activityDate}/${
                    record.activityTime
                  }`
                });
              }}
            >
              参与
            </a>
          </AuthWrapper>
        </div>
      );
    }
  };
}
