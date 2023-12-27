import * as React from 'react';
import {
  Table,
  Row,
  Col,
  Popconfirm,
  Button,
  message,
  Input,
  Switch
} from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';
import { GoodsModal } from 'biz';

import { DataGrid } from 'qmkit';

const { Column } = Table;

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;
const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    have: String;
    history?: any;
    marketingType?: any;
    relaxProps?: {
      goodsPageContent: IList;
      brands: IList;
      cates: IList;
      coinActivityGoodsVoList: IList;
      oneGoodsTermination: Function;
      wareId: Number;
      isShowActiveStatus: Boolean;
    };
    onChangeBack: Function;
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    coinActivityGoodsVoList: 'coinActivityGoodsVoList',
    wareId: 'wareId',
    isShowActiveStatus: 'isShowActiveStatus',
    oneGoodsTermination: noop
  };
  state = {
    //公用的商品弹出框
    goodsModal: {
      _modalVisible: false,
      _selectedSkuIds: [],
      _selectedRows: []
    },
    //营销活动已选的商品信息
    selectedSkuIds: [],
    selectedRows: fromJS([]),
    skuExists: [],
    originIds: []
  };
  componentWillReceiveProps(nextProps) {
    const { coinActivityGoodsVoList } = nextProps.relaxProps;
    const ids = coinActivityGoodsVoList
      .toJS()
      .map((e) => e.goodsInfoId)
      .join(',')
      .split(',');
    this.setState({
      selectedSkuIds: ids,
      originIds: ids
    });
  }

  render() {
    const {
      goodsPageContent,
      brands,
      cates,
      coinActivityGoodsVoList,
      oneGoodsTermination,
      wareId,
      isShowActiveStatus
    } = this.props.relaxProps;
    const { have } = this.props;
    const { selectedRows, goodsModal, skuExists, originIds } = this.state;
    const rows = [];
    selectedRows.toJS().forEach((element) => {
      if (originIds.indexOf(element.goodsInfoId) == -1) {
        rows.push(element);
      }
    });
    if (!coinActivityGoodsVoList || !goodsPageContent) {
      return null;
    }
    let dataSource = coinActivityGoodsVoList.map((scope) => {
      let goodInfo = fromJS(goodsPageContent).find(
        (s) => s.get('goodsInfoId') == scope.get('goodsInfoId')
      );

      if (goodInfo) {
        const cId = goodInfo.get('cateId');
        const cate = fromJS(cates || []).find((s) => s.get('cateId') === cId);
        goodInfo = goodInfo.set('cateName', cate ? cate.get('cateName') : '-');

        const bId = goodInfo.get('brandId');
        const brand = fromJS(brands || []).find(
          (s) => s.get('brandId') === bId
        );
        goodInfo = goodInfo.set(
          'brandName',
          brand ? brand.get('brandName') : '-'
        );
        const displayType = scope.get('displayType') || 0;
        goodInfo = goodInfo.set('displayType', displayType);
        return goodInfo;
      }
    });
    dataSource = dataSource.filter((goodsInfo) => goodsInfo);
    const listj = dataSource.toJS();
    coinActivityGoodsVoList.toJS().forEach((element) => {
      listj.forEach((el) => {
        if (element.scopeId == el.goodsInfoId) {
          // console.log(el.purchaseNum, '1231231', element.purchaseNum);
          el.purchaseNum = element.purchaseNum;
          el.perUserPurchaseNum = element.perUserPurchaseNum;
        }
      });
    });
    return (
      <div>
        {have && have == '9' && (
          <Button
            type="primary"
            icon="plus"
            style={{ marginTop: 20 }}
            onClick={this.openGoodsModal}
          >
            添加商品
          </Button>
        )}
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>已选商品：</span>
            </Col>
          </Row>
        </GreyBg>
        <Table
          dataSource={listj}
          pagination={false}
          scroll={{ y: 500 }}
          rowKey="goodsInfoId"
        >
          {!util.isThirdStore() && (
            <Column
              width="10%"
              title="SKU编码"
              key="goodsInfoNo"
              dataIndex="goodsInfoNo"
            />
          )}

          {!util.isThirdStore() && (
            <Column
              width="15%"
              title="ERP编码"
              key="erpGoodsInfoNo"
              dataIndex="erpGoodsInfoNo"
            />
          )}

          <Column
            width={!util.isThirdStore() ? '20%' : '45%'}
            title="商品名称"
            key="goodsInfoName"
            dataIndex="goodsInfoName"
          />
          {util.isThirdStore() && (
            <Column
              title="规格"
              dataIndex="specText"
              key="specText"
              width="15%"
              render={(value, row: any) => {
                const result = [];
                row.goodsAttributeKeys?.forEach((item) => {
                  result.push(item.goodsAttributeValue);
                });
                return result.join('-');
              }}
            />
          )}
          <Column width="8%" title="类目" key="cateName" dataIndex="cateName" />
          <Column
            width="10%"
            title="品牌"
            key="brandName"
            dataIndex="brandName"
          />
          <Column
            width="7%"
            key="priceType"
            title={'销售价'}
            render={(rowInfo) => <div>{rowInfo.salePrice}</div>}
          />
          <Column
            width="8%"
            key="displayType"
            title={'是否显示'}
            render={(rowInfo) => {
              return <Switch checked={rowInfo.displayType === 0} disabled />;
            }}
          />
          {isShowActiveStatus && (
            <Column
              width="8%"
              key="terminationFlag"
              title={'商品状态'}
              render={(rowInfo) => (
                <div>{rowInfo.terminationFlag == 0 ? '参与中' : '已终止'}</div>
              )}
            />
          )}

          {isShowActiveStatus && have && have == '9' ? (
            <Column
              width="8%"
              key="operation"
              title={'操作'}
              render={(rowInfo) => (
                <AuthWrapper functionName="f_jinbi_return_view-tow">
                  <a
                    href="javascript:;"
                    onClick={() =>
                      oneGoodsTermination(
                        coinActivityGoodsVoList.find(
                          (scope) =>
                            scope.get('goodsInfoId') == rowInfo.goodsInfoId
                        ),
                        have
                      )
                    }
                  >
                    {rowInfo.terminationFlag == 0 ? '终止' : ''}
                  </a>
                  {rowInfo.terminationFlag != 0 ? '已终止' : ''}
                </AuthWrapper>
              )}
            />
          ) : null}
        </Table>
        <GoodsModal
          visible={goodsModal._modalVisible}
          wareId={Number(wareId)}
          selectedSkuIds={goodsModal._selectedSkuIds}
          selectedRows={goodsModal._selectedRows}
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
        />
        {have && have == '9' && selectedRows.toJS().length > 0 && (
          <TableRow>
            <div>新增的商品列表</div>
            <DataGrid
              scroll={{ y: 500 }}
              size="small"
              rowKey={(record) => record.goodsInfoId}
              dataSource={rows ? rows : []}
              pagination={false}
              rowClassName={(record) => {
                if (fromJS(skuExists).includes(record.goodsInfoId)) {
                  return 'red';
                } else {
                  return '';
                }
              }}
            >
              <Column
                title="SKU编码"
                dataIndex="goodsInfoNo"
                key="goodsInfoNo"
                width="10%"
              />

              <Column
                title="ERP编码"
                dataIndex="erpGoodsInfoNo"
                key="erpGoodsInfoNo"
                width="12%"
              />
              <Column
                title="商品名称"
                dataIndex="goodsInfoName"
                key="goodsInfoName"
                width="20%"
              />
              {util.isThirdStore() && (
                <Column
                  title="规格"
                  dataIndex="specText"
                  key="specText"
                  width="10%"
                  render={(value, row: any) => {
                    const result = [];
                    row.goodsAttributeKeys?.forEach((item) => {
                      result.push(item.goodsAttributeValue);
                    });
                    return result.join('-');
                  }}
                />
              )}
              <Column
                title="适用区域"
                dataIndex="wareName"
                key="wareName"
                width="10%"
              />

              <Column
                title="分类"
                key="cateName"
                dataIndex="cateName"
                width="8%"
              />

              <Column
                title="品牌"
                key="brandName"
                dataIndex="brandName"
                width="10%"
                render={(value) => {
                  if (value) {
                    return value;
                  } else {
                    return '-';
                  }
                }}
              />

              <Column
                title="单价"
                key="marketPrice"
                width="8%"
                render={(data) => {
                  let { specialPrice, marketPrice } = data;
                  marketPrice = specialPrice ? specialPrice : marketPrice;
                  return `¥${marketPrice}`;
                }}
              />

              <Column
                title="是否显示"
                key="displayType"
                dataIndex="displayType"
                width="8%"
                render={(text, row: any) => {
                  return (
                    <Switch
                      checked={text === 0}
                      onChange={(checked) =>
                        this.changeDisplay(row.goodsInfoId, checked)
                      }
                    />
                  );
                }}
              />

              <Column
                title="操作"
                key="operate"
                width="8%"
                render={(row) => {
                  return (
                    <a onClick={() => this.deleteSelectedSku(row.goodsInfoId)}>
                      删除
                    </a>
                  );
                }}
              />
            </DataGrid>
          </TableRow>
        )}
      </div>
    );
  }

  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    });
    const { onChangeBack } = this.props;
    onChangeBack(
      selectedRows.delete(
        selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId)
      )
    );
  };
  /**
   * 关闭货品选择modal
   */
  closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };

  /**
   * 货品选择方法的回调事件
   * @param selectedSkuIds
   * @param selectedRows
   */
  skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
    const { originIds } = this.state;
    // let preSelectedSkuIds = this.state.selectedSkuIds
    // selectedSkuIds = this.arrayRemoveArray(selectedSkuIds, preSelectedSkuIds)
    selectedSkuIds = [...new Set(selectedSkuIds)];
    selectedRows = fromJS(
      [...new Set(selectedRows.toJS())].map((item) => {
        let opt: any = item;
        if (opt.displayType !== 1) {
          opt.displayType = 0;
        }
        return opt;
      })
    );
    if (selectedSkuIds.length > 0) {
      this.setState({
        selectedSkuIds,
        selectedRows,
        goodsModal: { _modalVisible: false }
      });
    } else {
      this.setState({
        goodsModal: { _modalVisible: false }
      });
    }
    const { onChangeBack } = this.props;
    onChangeBack(selectedRows);
  };
  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    const { selectedRows, selectedSkuIds } = this.state;

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * 已添加商品修改是否显示开关
   */
  changeDisplay = (id, checked) => {
    const { selectedRows } = this.state;
    const newRows = selectedRows.toJS().map((item) => {
      if (item.goodsInfoId === id) {
        item.displayType = checked ? 0 : 1;
      }
      return item;
    });
    this.setState({ selectedRows: fromJS(newRows) });
    const { onChangeBack } = this.props;
    onChangeBack(fromJS(newRows));
  };
}
