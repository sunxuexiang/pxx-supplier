import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
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
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
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
      key: 'goodsInfoName',
      dataIndex: 'goodsInfo.goodsInfoName',
      title: '商品名称'
    },
    {
      key: 'goods',
      dataIndex: 'goodsInfo.goodsInfoNo',
      title: 'SKU编码'
    },
    {
      key: 'specText',
      dataIndex: 'specText',
      title: '规格'
    },
    {
      key: 'goodsInfoStock',
      dataIndex: 'goodsInfo.stock',
      title: '现有库存'
    },
    {
      key: 'marketPrice',
      dataIndex: 'goodsInfo.marketPrice',
      title: '门店价',
      render: (data) => (data == null ? 0 : data)
    },
    {
      key: 'cateName',
      dataIndex: 'flashSaleCateVO.cateName',
      title: '分类'
    },
    {
      key: 'stock',
      dataIndex: 'stock',
      title: '抢购库存'
    },
    {
      key: 'maxNum',
      dataIndex: 'maxNum',
      title: '限购数量',
      render: (data) => (data > 100 ? 100 : data)
    },
    {
      key: 'minNum',
      dataIndex: 'minNum',
      title: '起售数量'
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '抢购价'
    },
    {
      key: 'postage',
      dataIndex: 'postage',
      title: '是否包邮',
      render: (data) => (data == 0 ? '否' : '是')
    },
    {
      key: 'option',
      title: '操作',
      width: '110px',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_flash_sale_goods_modify'}>
          {rowInfo.modifyFlag == 1 && (
            <a style={styles.edit} onClick={() => this._onEdit(rowInfo.id)}>
              编辑
            </a>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_flash_sale_goods_del'}>
          {rowInfo.modifyFlag == 1 && (
            <a onClick={() => this._onDelete(rowInfo.id)}>删除</a>
          )}
        </AuthWrapper>
        {rowInfo.modifyFlag != 1 && '-'}
      </div>
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
