import * as React from 'react';
import {
  Table,
  Row,
  Col,
  Popconfirm,
  Button,
  message,
  Input,
  Checkbox
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
    skuExists: any;
    relaxProps?: {
      goodsPageContent: IList;
      brands: IList;
      cates: IList;
      marketingScopeList: IList;
      subType: number;
      isShowActiveStatus: Boolean;
      oneGoodsTermination: Function;
      wareId: Number;
    };
    onChangeBack: Function;
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    marketingScopeList: 'marketingScopeList',
    subType: 'subType',
    isShowActiveStatus: 'isShowActiveStatus',
    wareId: 'wareId',
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
    originIds: []
  };
  componentWillReceiveProps(nextProps) {
    const { marketingScopeList } = nextProps.relaxProps;
    const ids = marketingScopeList
      .toJS()
      .map((e) => e.scopeId)
      .join(',')
      .split(',');
    this.setState({
      selectedSkuIds: ids,
      originIds: ids
    });
    // console.log(marketingScopeList.toJS(), '123123123');
  }

  render() {
    const {
      goodsPageContent,
      brands,
      cates,
      marketingScopeList,
      subType,
      isShowActiveStatus,
      oneGoodsTermination,
      wareId
    } = this.props.relaxProps;
    const { have, skuExists } = this.props;
    const { selectedSkuIds, selectedRows, goodsModal, originIds } = this.state;

    const rows = [];
    selectedRows.toJS().forEach((element) => {
      if (originIds.indexOf(element.goodsInfoId) == -1) {
        rows.push(element);
      }
    });
    if (!marketingScopeList || !goodsPageContent) {
      return null;
    }
    let dataSource = marketingScopeList.map((scope) => {
      let goodInfo = fromJS(goodsPageContent).find(
        (s) => s.get('goodsInfoId') == scope.get('scopeId')
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
        goodInfo = goodInfo.set(
          'whetherChoice',
          scope ? scope.get('whetherChoice') : ''
        );
        return goodInfo;
      }
    });
    dataSource = dataSource.filter((goodsInfo) => goodsInfo);
    const listj = dataSource.toJS();
    marketingScopeList.toJS().forEach((element) => {
      listj.forEach((el) => {
        if (element.scopeId == el.goodsInfoId) {
          // console.log(el.purchaseNum, '1231231', element.purchaseNum);
          el.purchaseNum = element.purchaseNum;
          el.perUserPurchaseNum = element.perUserPurchaseNum;
        }
      });
    });
    if (subType == 6 || subType == 7 || subType == 8) {
      return <div></div>;
    }
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
          <Column width="8%" title="类目" key="cateName" dataIndex="cateName" />
          <Column
            width="8%"
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
            width="7%"
            key="marketingLabels"
            title={'必选商品'}
            render={(rowInfo) => (
              //<div>{rowInfo.marketingLabels[0]}</div>
              <div>{rowInfo.whetherChoice == 0 ? '否' : '是'}</div>
            )}
          />
          <Column
            width="8%"
            key="purchaseNum"
            title={'总限购数量'}
            render={(rowInfo) => (
              <div>
                {rowInfo.purchaseNum && rowInfo.purchaseNum > 0
                  ? rowInfo.purchaseNum
                  : '无'}{' '}
              </div>
            )}
          />
          <Column
            width="8%"
            key="perUserPurchaseNum"
            title={'单用户限购量'}
            render={(rowInfo) => (
              //<div>{rowInfo.marketingLabels[0]}</div>
              <div>
                {rowInfo.perUserPurchaseNum && rowInfo.perUserPurchaseNum > 0
                  ? rowInfo.perUserPurchaseNum
                  : '无'}{' '}
              </div>
            )}
          />
          {isShowActiveStatus ? (
            <Column
              width="8%"
              key="terminationFlag"
              title={'活动状态'}
              render={(rowInfo) => (
                <div>{rowInfo.terminationFlag == 0 ? '参与中' : '已终止'}</div>
              )}
            />
          ) : null}
          {isShowActiveStatus ? (
            <Column
              width="8%"
              key="operation"
              title={'操作'}
              render={(rowInfo) => (
                // <AuthWrapper functionName="f_marketing_view">
                <AuthWrapper functionName="f_marketing_view-tow">
                  <a
                    href="javascript:;"
                    onClick={() =>
                      oneGoodsTermination(
                        marketingScopeList.find(
                          (scope) => scope.get('scopeId') == rowInfo.goodsInfoId
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
          //商家入驻需求 wareId传''
          // wareId={Number(wareId)}
          wareId=""
          needHide
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
                width="12%"
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
              <Column
                title="适用区域"
                dataIndex="wareName"
                key="wareName"
                width="8%"
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
                width="8%"
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
                title="总限购量"
                key="purchaseNum"
                width="12%"
                render={(row) => {
                  return (
                    <div>
                      {row.isDisable == 0 ? (
                        <Input
                          defaultValue={
                            row.purchaseNum && row.purchaseNum > -1
                              ? row.purchaseNum
                              : ''
                          }
                          onChange={(e) => {
                            this.purchChange(e, row.goodsInfoId, 'purchaseNum');
                          }}
                          placeholder="限购数量"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        '已限购'
                      )}
                    </div>
                  );
                }}
              />

              <Column
                title="单用户限购量"
                key="perUserPurchaseNum"
                width="12%"
                render={(row) => {
                  return (
                    <div>
                      {row.isDisable == 0 ? (
                        <Input
                          defaultValue={
                            row.perUserPurchaseNum &&
                            row.perUserPurchaseNum > -1
                              ? row.perUserPurchaseNum
                              : ''
                          }
                          value={row.perUserPurchaseNum}
                          onChange={(e) => {
                            let t = e.target.value;
                            if (
                              Number(t || 0) < Number(row.purchaseNum || 0) ||
                              t == '0' ||
                              t == ''
                            ) {
                              this.purchChange(
                                e,
                                row.goodsInfoId,
                                'perUserPurchaseNum'
                              );
                            } else {
                              message.error('单用户限购数量不能大于总限购量');
                            }
                          }}
                          placeholder="单用户限购数量"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        '已限购'
                      )}
                    </div>
                  );
                }}
              />

              {/* <Column
                title="限购数量"
                key="purchaseNum"
                width="12%"
                render={(row) => {
                  return (
                    <div>
                      {row.isDisable == 0 ? (
                        <Input
                          defaultValue={row.purchaseNum && row.purchaseNum > -1 ? row.purchaseNum : '0'}
                          onChange={(e) => {
                            this.purchChange(e, row.goodsInfoId);
                          }}
                          placeholder="限购数量"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        '已限购'
                      )}
                    </div>
                  );
                }}
              />

              <Column
                title="必选商品"
                key="checked"
                width="7%"
                render={(row) => {
                  return (
                    <div>
                      <Checkbox
                        checked={row.checked}
                        onChange={(e) => {
                          this.cheBOx(row.goodsInfoId);
                        }}
                      />
                    </div>
                  );
                }}
              /> */}

              <Column
                title="操作"
                key="operate"
                width="10%"
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
  // 必选商品
  cheBOx = (id) => {
    const { selectedRows } = this.state;
    // console.log(selectedRows.toJS(), '66666666666666');
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e.checked = !e.checked;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
    const { onChangeBack } = this.props;
    onChangeBack(fromJS(goodslk));
  };
  purchChange = (e, id, key) => {
    const value = e.target.value;
    const numbezzs = /^[1-9]\d*$/;
    if (value != '') {
      if (!numbezzs.test(value)) {
        message.error('请输入整数，合法数字');
      }
      this.purChange(value === '' ? null : value, id, key);
    } else {
      this.purChange(value === '' ? null : value, id, key);
    }
  };
  purChange = (value, id, key) => {
    const { selectedRows } = this.state;
    const goodslk = selectedRows.toJS();
    goodslk.forEach((e) => {
      if (e.goodsInfoId == id) {
        e[key] = value;
      }
    });
    this.setState({
      selectedRows: fromJS(goodslk)
    });
    const { onChangeBack } = this.props;
    onChangeBack(fromJS(goodslk));
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
    selectedRows = fromJS([...new Set(selectedRows.toJS())]);
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
    // console.log(
    //   selectedRows,
    //   selectedSkuIds,
    //   'selectedRows, selectedSkuIds selectedRows, selectedSkuIds '
    // );

    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };
}
