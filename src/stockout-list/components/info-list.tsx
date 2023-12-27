import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, DataGrid, AuthWrapper, history, FindArea } from 'qmkit';
import { Modal, Table, Tooltip } from 'antd';
import Moment from 'moment';
import { IList } from 'typings/globalType';
const { Column } = DataGrid;
const confirm = Modal.confirm;

const defaultImg = require('../img/none.png');
@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      checkedIds,
      onSelect,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="stockoutId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        expandedRowRender={this._expandedRowRender}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: checkedIds.toJS(),
          onChange: (checkedRowKeys) => {
            onSelect(checkedRowKeys);
          }
        }}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
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
      title: '主图',
      dataIndex: 'goodsInfoImg',
      key: 'goodsInfoImg',
      render: (img) =>
        img ? (
          <img src={img} style={styles.imgItem} />
        ) : (
          <img src={defaultImg} style={styles.imgItem} />
        )
    },
    {
      key: 'goodsName',
      dataIndex: 'goodsName',
      title: '商品名称'
    },
    {
      key: 'goodsInfoNo',
      dataIndex: 'goodsInfoNo',
      title: 'SKU编码'
    },
    {
      key: '',
      dataIndex: '',
      title: '会员'
    },
    {
      key: '',
      dataIndex: '',
      title: '销售经理'
    },
    {
      key: 'brandName',
      dataIndex: 'brandName',
      title: '品牌'
    },
    {
      key: 'stockoutNum',
      dataIndex: 'stockoutNum',
      title: '缺货数量'
    },
    {
      title: '缺货地区',
      key: 'stockoutCity',
      dataIndex: 'stockoutCity',
      width: 500,
      render: (text, record) => {
        let arrCity = FindArea.getProvinceNameAndCityName(text);
        return (
          <div className="td-text-wrapper">
            <Tooltip title={arrCity}>
              <span>{arrCity}</span>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a style={styles.edit} onClick={() => this._onEdit(rowInfo.stockoutId)}>
          编辑
        </a>
        {/*</AuthWrapper>*/}
        {/*<AuthWrapper functionName={'f_xxx'}>*/}
        <a onClick={() => this._onDelete(rowInfo.stockoutId)}>删除</a>
        {/*</AuthWrapper>*/}
      </div>
    );
  };
  _expandedRowRender = (record, index) => {
    // console.log(JSON.stringify(record))
    // console.log(JSON.stringify(record.stockoutDetailList))
    return (
      <DataGrid
        rowKey={(record) => record.stockoutDetailId}
        dataSource={record.stockoutDetailList}
        pagination={false}
        scroll={{ y: 500 }}
      >
        <Column
          title="下单时间"
          dataIndex="createTime"
          key="createTime"
          width="40%"
          render={(createTime) => {
            return (
              '下单时间：' +
              Moment(createTime).format(Const.TIME_FORMAT).toString()
            );
          }}
        />

        <Column
          title="会员"
          dataIndex="customerName"
          key="customerName"
          width="20%"
          render={(customerName) => {
            return customerName ? customerName : '-';
          }}
        />
        <Column
          title="销售经理"
          dataIndex="employeeName"
          key="employeeName"
          width="10%"
          render={(employeeName) => {
            return employeeName ? employeeName : '-';
          }}
        />
        <Column
          width="10%"
          title="缺货数量"
          dataIndex="stockoutNum"
          key="stockoutNum"
        />
        <Column
          title="缺货地址"
          dataIndex="address"
          key="address"
          width="20%"
          render={(address) => {
            if (address) {
              let cityCode = address.split('|');
              if (cityCode.length == 3) {
                return FindArea.addressInfo(
                  cityCode[0],
                  cityCode[1],
                  cityCode[2]
                );
              } else {
                return address ? address : '-';
              }
            } else {
              return '-';
            }
          }}
        />
      </DataGrid>
    );
  };
  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
}
const styles = {
  edit: {
    paddingRight: 10
  },
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  cell: {
    color: '#999',
    width: 200,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 120,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
