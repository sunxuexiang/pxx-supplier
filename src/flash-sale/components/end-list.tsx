import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, history, noop } from 'qmkit';
import { Table } from 'antd';
import { IList } from 'typings/globalType';

@Relax
export default class EndList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      getEndList: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    getEndList: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      getEndList
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="pointsGoodsId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            getEndList({ pageNum: pageNum - 1, pageSize });
          }
        }}
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
      render: (record) => {
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
      }
    }
  ];
}
