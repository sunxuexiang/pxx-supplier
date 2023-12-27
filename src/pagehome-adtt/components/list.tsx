import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Popconfirm, Table } from 'antd';
import { AnyAction } from 'redux';
const { Column } = Table;
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      form: IMap;
      deleteCoupon: Function;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    form: 'form',
    deleteCoupon: noop,
    init: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponList,
      deleteCoupon,
      init
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.couponId}
        dataSource={couponList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column title="序号" dataIndex="sortNum" key="sortNum" />
        <Column
          title="图片"
          // dataIndex="goodsImg"
          // key="goodsImg"
          render={(img) =>
            img.advertisingConfigList.map((item, index) => {
              return item.advertisingImage ? (
                <img
                  src={item.advertisingImage}
                  key={index}
                  style={styles.imgItem}
                />
              ) : (
                ''
              );
            })
          }
        />
        <Column
          title="名称"
          dataIndex="advertisingName"
          key="advertisingName"
        />
        <Column
          title="类型"
          render={(value) => {
            if (value.advertisingType == 0) {
              return '通栏推荐位';
            } else if (value.advertisingType == 1) {
              return '分栏推荐位';
            } else {
              return '轮播推荐位';
            }
          }}
        />
        <Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">
                <Link to={this.FunisLink(record)}>编辑</Link>

                <Popconfirm
                  title="确定删除该推荐位？"
                  onConfirm={() => deleteCoupon((record as any).advertisingId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
  FunisLink(record: any) {
    let { form } = this.props.relaxProps;
    if (record.advertisingType == 0) {
      return `/pagehome-addtl/${record.advertisingId}`;
    } else if (record.advertisingType == 1) {
      return `/pageclass-addtl/${record.advertisingId}`;
    } else {
      return `/pagehome-swit/${record.advertisingId}`;
    }
  }
}
const styles = {
  imgItem: {
    width: '90px',
    height: '80px',
    padding: ' 5px',
    border: '1px solid #ddd',
    float: 'left',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '3px'
  }
};
