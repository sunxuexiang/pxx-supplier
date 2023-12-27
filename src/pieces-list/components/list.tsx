import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      pageVillages: IList;
      deleteCoupon: Function;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    pageVillages: 'pageVillages',
    deleteCoupon: noop,
    init: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      pageVillages,
      deleteCoupon,
      init
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.couponId}
        dataSource={pageVillages.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column
          title="序号"
          render={(text, record, index) => {
            return index + 1;
          }}
        />
        {/* <DataGrid.Column
          title="图片"
          // dataIndex="goodsImg"
          // key="goodsImg"
          render={(img) =>
            img.advertisingConfigList.map((item, index) => {
              return (
                item.advertisingImage ? <img src={item.advertisingImage} style={styles.imgItem} /> : ''
              )
            })
          }
        /> */}
        <DataGrid.Column
          title="省"
          dataIndex="provinceName"
          key="provinceName"
        />
        <DataGrid.Column title="市" dataIndex="cityName" key="cityName" />

        <DataGrid.Column title="区/县" dataIndex="areaName" key="areaName" />
        <DataGrid.Column
          title="街道/乡/镇"
          dataIndex="villageName"
          key="villageName"
        />
        <DataGrid.Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(text, record) => {
            return (
              <div className="operation-box">
                {/* <Link to={this.FunisLink(record)}>
                    编辑
                  </Link> */}

                <Popconfirm
                  title="确定删除该地址？"
                  onConfirm={() => deleteCoupon((record as any).id)}
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
  FunisLink(record) {
    if (record.advertisingType == 0) {
      return `/pagehome-addtl/${(record as any).advertisingId}`;
    } else if (record.advertisingType == 1) {
      return `/pageclass-addtl/${(record as any).advertisingId}`;
    } else {
      return `/pagehome-swit/${(record as any).advertisingId}`;
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
