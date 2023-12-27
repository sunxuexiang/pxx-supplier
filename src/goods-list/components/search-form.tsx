import React from 'react';
import { Relax } from 'plume2';
import {
  Form,
  Input,
  Button,
  Select,
  Tree,
  AutoComplete,
  Alert,
  message,
  Modal
} from 'antd';
import {
  noop,
  SelectGroup,
  TreeSelectGroup,
  InputGroupCompact,
  AutoCompleteGroup,
  history,
  util,
  ExportModal,
  Const,
  cache
} from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import styled from 'styled-components';
import { getReturnAddressList } from '../webapi';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
const AutoOption = AutoComplete.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeErpNo: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      goodsType: string;
      specialPriceFirst: any;
      specialPriceLast: any;
      saleType: any;
      stockUp: any;
      goodsInfoBatchNo: any;
      manySpecs: any;
      wareId: any;
      searchForm: any;
      exportGoodsList: Function;
      onExportModalShow: Function;
      exportModalData: IMap;
      onExportModalHide: Function;
      isAddGoodsLoading: boolean;
      changeAddGoodsStatus: Function;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    likeErpNo: 'likeErpNo',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    brandId: 'brandId',
    onSearch: noop,
    onFormFieldChange: noop,
    changeAddGoodsStatus: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    goodsType: 'goodsType',
    specialPriceFirst: 'specialPriceFirst',
    specialPriceLast: 'specialPriceLast',
    saleType: 'saleType',
    stockUp: 'stockUp',
    goodsInfoBatchNo: 'goodsInfoBatchNo',
    manySpecs: 'manySpecs',
    wareId: 'wareId',
    exportModalData: 'exportModalData',
    onExportModalHide: noop,
    exportGoodsList: noop,
    onExportModalShow: noop,
    isAddGoodsLoading: 'isAddGoodsLoading'
  };

  render() {
    const {
      likeGoodsName,
      likeErpNo,
      likeGoodsInfoNo,
      likeGoodsNo,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onEditSkuNo,
      goodsType,
      specialPriceFirst,
      specialPriceLast,
      storeCateId,
      brandId,
      saleType,
      stockUp,
      goodsInfoBatchNo,
      manySpecs,
      wareId,
      exportGoodsList,
      exportModalData,
      onExportModalHide,
      isAddGoodsLoading,
      changeAddGoodsStatus
    } = this.props.relaxProps;

    const isThird = util.isThirdStore();
    const logInfo = sessionStorage.getItem(cache.LOGIN_DATA)
      ? JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      : {};

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('storeCateId')}
            value={item.get('storeCateId')}
            title={item.get('cateName')}
          />
        );
      });
    const wareList = JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={likeGoodsName}
              onChange={(e: any) => {
                onFormFieldChange({
                  key: 'likeGoodsName',
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          {!isThird && (
            <FormItem>
              <Input
                addonBefore="ERP编码"
                value={likeErpNo}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeErpNo',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <Input
                addonBefore="SPU编码"
                value={likeGoodsNo}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsNo',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <Input
                addonBefore="SKU编码"
                value={likeGoodsInfoNo}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsInfoNo',
                    value: e.target.value
                  });
                  onEditSkuNo(e.target.value);
                }}
              />
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <TreeSelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="店铺分类"
                // defaultValue="全部"
                value={storeCateId}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={(value) => {
                  onFormFieldChange({ key: 'storeCateId', value });
                }}
              >
                <TreeNode key="-1" value="-1" title="全部">
                  {loop(cateList)}
                </TreeNode>
              </TreeSelectGroup>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="品牌"
                  defaultValue="全部"
                  showSearch
                  optionFilterProp="children"
                  value={brandId}
                  onChange={(value) => {
                    onFormFieldChange({ key: 'brandId', value });
                  }}
                >
                  <Option key="-1" value="-1">
                    全部
                  </Option>
                  {brandList.map((v, i) => {
                    return (
                      <Option key={i} value={v.get('brandId') + ''}>
                        {v.get('brandName')}
                      </Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="销售类型"
                  defaultValue="全部"
                  value={saleType}
                  showSearch
                  onChange={(value) => {
                    onFormFieldChange({ key: 'saleType', value });
                  }}
                >
                  <Option value="-1">全部</Option>
                  <Option value="0">批发</Option>
                  <Option value="1">零售</Option>
                  <Option value="2">散批</Option>
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="商品类型"
                  defaultValue="全部"
                  showSearch
                  value={goodsType}
                  onChange={(value) => {
                    onFormFieldChange({ key: 'goodsType', value });
                  }}
                >
                  <Option value="">全部</Option>
                  <Option value="1">特价商品</Option>
                  <Option value="0">普通商品</Option>
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="囤货状态"
                  defaultValue=""
                  showSearch
                  value={stockUp || ''}
                  onChange={(value) => {
                    onFormFieldChange({ key: 'stockUp', value });
                  }}
                >
                  <Option value="">全部</Option>
                  <Option value="3">全部囤货状态</Option>
                  <Option value="1">囤货中</Option>
                  <Option value="2">已囤完</Option>
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <InputGroupCompact
                title="价格范围"
                precision={2}
                startMin={0}
                start={specialPriceFirst}
                onStartChange={(val) =>
                  onFormFieldChange({ key: 'specialPriceFirst', value: val })
                }
                endMin={0}
                end={specialPriceLast}
                onEndChange={(val) =>
                  onFormFieldChange({ key: 'specialPriceLast', value: val })
                }
              />
            </FormItem>
          )}

          {!isThird && (
            <FormItem>
              <AutoCompleteGroup
                size="default"
                label="批次号"
                style={{ width: 180 }}
                value={goodsInfoBatchNo}
                // dataSource={this._renderOption(storeMap.toJS())}
                // onSelect={(value) =>
                //     onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
                // }
                onChange={(value) =>
                  onFormFieldChange({ key: 'goodsInfoBatchNo', value: value })
                }
                allowClear={true}
                placeholder=""
              />
            </FormItem>
          )}
          <FormItem style={{ display: 'none' }}>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="商品规格"
                // defaultValue=""
                showSearch
                value={manySpecs || '0'}
                onChange={(value) => {
                  onFormFieldChange({ key: 'manySpecs', value });
                }}
              >
                <Option value="0">全部</Option>
                <Option value="1">单规格</Option>
                <Option value="2">多规格</Option>
              </SelectGroup>
            </SelectBox>
          </FormItem>
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="所属仓库"
                  defaultValue="0"
                  showSearch
                  value={wareId}
                  onChange={(value) => {
                    onFormFieldChange({ key: 'wareId', value });
                  }}
                >
                  {wareList.map((ware) => {
                    return (
                      <Option key={ware.wareId} value={ware.wareId}>
                        {ware.wareName}
                      </Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="排序商品"
                  defaultValue=""
                  showSearch
                  onChange={(value) => {
                    onFormFieldChange({ key: 'storeGoodsSeqFlag', value });
                  }}
                >
                  <Option value="">全部</Option>
                  <Option value="0">未排序</Option>
                  <Option value="1">已排序</Option>
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                onSearch();
              }}
            >
              搜索
            </Button>
          </FormItem>
          {/* 第三方商家展示 */}
          {/* {util.isThirdStore() && (
            <React.Fragment>
              <FormItem>
                <Button
                  loading={isAddGoodsLoading}
                  type="primary"
                  htmlType="submit"
                  icon="plus"
                  onClick={() => this.handlerAddGoods(changeAddGoodsStatus)}
                >
                  新增商品
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="plus"
                  onClick={() => {
                    history.push({
                      pathname: '/goods-add-import'
                    });
                  }}
                >
                  导入商品
                </Button>
              </FormItem>
            </React.Fragment>
          )} */}
          {(!isThird || (isThird && logInfo.exportState === 1)) && (
            <FormItem>
              <Button
                type="primary"
                icon="download"
                onClick={() => {
                  if (!util.isThirdStore()) {
                    exportGoodsList();
                  } else {
                    this._batchExport();
                  }
                }}
              >
                导出商品
              </Button>
            </FormItem>
          )}
        </Form>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          extraDom={
            <Alert
              message=""
              description={
                <div>
                  <p>操作说明</p>
                  <p>
                    为保证效率,每次最多支持导出5000条记录，如需导出更多，请更换筛选条件后再次导出
                  </p>
                </div>
              }
              type="info"
            />
          }
        />
      </div>
    );
  }

  /**
   * 第三方商家 导出商品
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息',
      isThird: true
    });
  }

  /**
   * 点击了添加商品
   */
  async handlerAddGoods(changeAddGoodsStatus) {
    const goAddPage = () => {
      history.push({
        pathname: '/add-product'
      });
    };
    const goAddAddressPage = () => {
      history.push({
        pathname: '/store-info-edit'
      });
    };
    try {
      changeAddGoodsStatus(true);
      const storeId = util.getLoginData().storeId;
      const { res } = await getReturnAddressList({ storeId });
      if (res.code === Const.SUCCESS_CODE) {
        if (res.context.length > 0) {
          goAddPage();
        } else {
          Modal.confirm({
            title: '还没有添加退货地址',
            content: '请先去添加退货地址，然后再添加商品',
            onOk() {
              goAddAddressPage();
            },
            onCancel() {
              message.info('已取消');
            }
          });
        }
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      message.error(error.message || '操作失败');
    } finally {
      changeAddGoodsStatus(false);
    }
  }
}
