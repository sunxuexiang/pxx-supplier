import React from 'react';
import { Table, Button, message } from 'antd';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { noop, AuthWrapper } from 'qmkit';
const defaultImg = require('../img/none.png');
@Relax
export default class FreightGoodsList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      selectedRowKeys: IList;
      setFeightVisible: Function;
      setSelectedRowKeys: Function;
      freightWithGoods: IMap;
      init: Function;
      freightTemp: IMap;
      setGoodsId: Function;
      setFreightTempId: Function;
      setGoodsFreight: Function;
      setIsBatch: Function;
    };
  };

  static relaxProps = {
    selectedRowKeys: 'selectedRowKeys',
    setFeightVisible: noop,
    setSelectedRowKeys: noop,
    freightWithGoods: 'freightWithGoods',
    init: noop,
    freightTemp: 'freightTemp',
    setGoodsId: noop,
    setFreightTempId: noop,
    setGoodsFreight: noop,
    setIsBatch: noop
  };

  render() {
    const { selectedRowKeys, freightWithGoods } = this.props.relaxProps;
    const { goodsPage } = freightWithGoods.toJS();
    const total =
      goodsPage && goodsPage.totalElements ? goodsPage.totalElements : 0;
    const pageNum = goodsPage && goodsPage.number ? goodsPage.number : 0;
    const rowSelection = {
      selectedRowKeys: selectedRowKeys.toJS(),
      onChange: this._onSelectChange
    };
    return (
      <div>
        <AuthWrapper functionName="f_goods_rela_edit">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              disabled={total == 0}
              onClick={() => this._setBatchFeight()}
            >
              批量更换运费模板
            </Button>
          </div>
        </AuthWrapper>
        <Table
          rowKey={(record: any) => record.goodsId}
          rowSelection={rowSelection}
          columns={this._columns}
          dataSource={goodsPage && goodsPage.content ? goodsPage.content : []}
          pagination={{ total, current: pageNum + 1, onChange: this._getData }}
        />
      </div>
    );
  }

  _columns = [
    {
      title: '图片',
      dataIndex: 'goodsImg',
      key: 'goodsImg',
      render: (value) => {
        return value ? (
          <img src={value} style={styles.imgItem} />
        ) : (
          <img src={defaultImg} style={styles.imgItem} />
        );
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName'
    },
    {
      title: '重量/单位',
      dataIndex: 'goodsWeight',
      key: 'goodsWeight',
      render: (value, row) => {
        if (row.goodsUnit) {
          return value + 'kg/' + row.goodsUnit;
        }
        return value + 'kg';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_value, row) => (
        <AuthWrapper functionName="f_goods_rela_edit">
          <span>
            <a href="javascript:;" onClick={() => this._setFeight(row)}>
              更换运费模板
            </a>
          </span>
        </AuthWrapper>
      )
    }
  ];
  /**
   * 分页获取数据
   */
  _getData = (pageNum, pageSize) => {
    const { init, freightTemp } = this.props.relaxProps;
    const params = {
      pageNum: --pageNum,
      pageSize: pageSize,
      freightTempId: freightTemp.get('freightTempId')
    };
    init(params);
  };
  /**
   * 选中后获取spuId
   */
  _onSelectChange = (selectedRowKeys) => {
    const { setSelectedRowKeys } = this.props.relaxProps;
    setSelectedRowKeys(selectedRowKeys);
  };
  /**
   * 批量设置窗口
   */
  _setBatchFeight = () => {
    const {
      setFeightVisible,
      selectedRowKeys,
      setIsBatch,
      freightTemp,
      setFreightTempId,
      setGoodsFreight
    } = this.props.relaxProps;
    if (selectedRowKeys.toJS().length < 1) {
      message.error('至少选择一件商品');
      return;
    } else {
      setFreightTempId(freightTemp.get('freightTempId'));
      if (freightTemp.get('freightTempId')) {
        setGoodsFreight(freightTemp.get('freightTempId'), true);
      }
      setIsBatch(true);
      setFeightVisible(true);
    }
  };
  /**
   * 单个设置窗口
   */
  _setFeight = (row) => {
    const {
      setFeightVisible,
      setGoodsId,
      setFreightTempId,
      setGoodsFreight,
      setIsBatch
    } = this.props.relaxProps;
    setGoodsId(row.goodsId);
    setFreightTempId(row.freightTempId);
    if (row.freightTempId) {
      setGoodsFreight(row.freightTempId, true);
    }
    setIsBatch(false);
    setFeightVisible(true);
  };
}
const styles = {
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  }
} as any;
