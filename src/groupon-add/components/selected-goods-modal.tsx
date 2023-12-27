import * as React from 'react';
import { Button, Form, Input, Tree, Modal, Select, message } from 'antd';
import { Const, DataGrid, SelectGroup, TreeSelectGroup } from 'qmkit';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import * as webapi from '../webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const { Column } = DataGrid;

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/**
 * 优惠券选择弹窗
 */
export default class SelectedGoodsModal extends React.Component<any, any> {
  props;

  constructor(props) {
    super(props);
    this.state = {
      // 商品分页数据
      goodsPage: {},
      // 商品列表
      goodsInfos: [],
      // 搜索条件
      searchParams: {
        // 分页-当前页
        pageNum: 0,
        // 分页-每页数量
        pageSize: 10,
        // 商品名称
        likeGoodsName: '',
        // 模糊条件-SPU编码
        likeGoodsNo: '',
        // 店铺分类
        storeCateId: '',
        // 品牌分类
        brandId: ''
      },
      // 是否正在加载数据
      loading: true,
      // 选择的商品集合
      selectedSpuIds: props.selectedSpuIds,
      selectedSkus: props.selectedSkus.toJS()
    };
  }

  componentDidMount() {
    // 初始化分类列表、品牌列表
    this._pageSearch();
  }

  render() {
    return (
      <Modal
        maskClosable={false}
        visible={true}
        title={
          <div>
            选择商品&nbsp;
            <small>
              已选
              <span style={{ color: 'red' }}>
                {this.state.selectedSpuIds.length}
              </span>
              款商品
            </small>
          </div>
        }
        width={1200}
        onOk={() => this._onOk()}
        onCancel={() => this._onCancel()}
        okText="确认"
        cancelText="取消"
      >
        {/*search*/}
        {this._renderSearchForm()}
        {this._renderGrid()}
      </Modal>
    );
  }

  /**
   * 构建搜索表单虚拟dom
   */
  _renderSearchForm = () => {
    const { cates, brands } = this.props;

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              onChange={(e) =>
                this._onSearchParamChange({ likeGoodsName: e.target.value })
              }
            />
          </FormItem>

          <FormItem>
            <Input
              addonBefore="SPU编码"
              onChange={(e) =>
                this._onSearchParamChange({ likeGoodsNo: e.target.value })
              }
            />
          </FormItem>

          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="店铺分类"
              // defaultValue="全部"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              onChange={(value) => {
                this._onSearchParamChange({ storeCateId: value });
              }}
            >
              <TreeNode key="-1" value="" title="全部">
                {this.loop(cates, 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>
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
                onChange={(value) => {
                  this._onSearchParamChange({ brandId: value });
                }}
              >
                <Option key="-1" value="">
                  全部
                </Option>
                {brands.map((v, i) => {
                  return (
                    <Option key={i} value={v.get('brandId') + ''}>
                      {v.get('brandName')}
                    </Option>
                  );
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>

          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                this._pageSearch(0);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  };

  /**
   * 构建表格虚拟dom
   */
  _renderGrid = () => {
    const { goodsPage, selectedSpuIds } = this.state;
    return (
      <DataGrid
        loading={this.state.loading}
        rowKey={(record) => record.goodsId}
        dataSource={goodsPage.content}
        rowSelection={{
          selectedRowKeys: selectedSpuIds,
          onChange: (_selectedRowKeys, selectedTableRows) => {
            this._onSelectRow(selectedTableRows);
          },
          getCheckboxProps: (record) => ({
            disabled: record.grouponForbiddenFlag
          })
        }}
        pagination={{
          total: goodsPage.totalElements,
          current: goodsPage.number + 1,
          pageSize: goodsPage.size,
          onChange: (pageNum, pageSize) => {
            this._onPageSearch({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column title="SPU编码" dataIndex="goodsNo" key="goodsNo" width="15%" />

        <Column
          title="商品名称"
          dataIndex="goodsName"
          key="goodsInfoName"
          width="20%"
        />

        <Column title="分类" key="goodsCate" dataIndex="cateName" />

        <Column
          title="品牌"
          key="goodsBrand"
          dataIndex="brandName"
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
          dataIndex="marketPrice"
          render={(data) => {
            return data ? `¥${data.toFixed(2)}` : '¥0.00';
          }}
        />
      </DataGrid>
    );
  };

  /**
   * 搜索条件改变
   */
  _onSearchParamChange = (param) => {
    let searchParams = this.state.searchParams;
    for (let key in param) {
      searchParams[key] = param[key];
    }
    return new Promise((resolve) => {
      this.setState({ searchParams }, () => resolve());
    });
  };

  /**
   * 分页切换搜索
   */
  _onPageSearch = async (param) => {
    await this._onSearchParamChange(param);
    this._pageSearch();
  };

  /**
   * 勾选商品
   */
  _onSelectRow = (selectedTableRows) => {
    // 当前页商品列表
    const goodses = this.state.goodsPage.content;
    // 已选择的所有spuId列表
    let allSpuIds = this.state.selectedSpuIds;
    // 已选择的所有spu关联的skus
    let allSkus = this.state.selectedSkus;

    // 1.过滤出其它页面的所选spuIds、skus
    const goodsIds = goodses.map((item) => item.goodsId);
    const otherSpuIds = allSpuIds.filter((spuId) => !goodsIds.includes(spuId));
    const otherSkus = allSkus.filter((i) => !goodsIds.includes(i.goodsId));

    // 2.合并当前页面最新所选spuIds、skus
    const selectedSpuIds = selectedTableRows.map((item) => item.goodsId);
    allSpuIds = otherSpuIds.concat(selectedSpuIds);
    allSkus = otherSkus.concat(
      this.state.goodsInfos.filter((item) =>
        selectedSpuIds.includes(item.goodsId)
      )
    );

    // 3.设值
    this.setState({
      selectedSpuIds: allSpuIds,
      selectedSkus: allSkus
    });
  };

  /**
   * 确认选择商品
   */
  _onOk = () => {
    const { selectedSpuIds, selectedSkus } = this.state;

    if (selectedSpuIds.length > 200) {
      message.error('最多可选200个商品');
      return;
    }

    this.props.onOk(fromJS(selectedSkus));
  };

  /**
   * 取消选择商品
   */
  _onCancel = () => {
    this.props.onCancel();
  };

  /**
   * 分页查询
   */
  _pageSearch = async (page?) => {
    this.setState({ loading: true });
    // 1.从state中获取查询条件
    const params = this.state.searchParams;
    if (page != null) {
      await this._onSearchParamChange({ pageNum: page });
    }
    if (params.likeGoodsName == '') delete params.likeGoodsName;
    if (params.storeCateId == '') delete params.storeCateId;
    if (params.brandId == '') delete params.brandId;

    // 2.调用查询接口
    params.isMarketingChose = 1;
    params.activityStartTime = this.props.startTime;
    params.activityEndTime = this.props.endTime;
    params.goodsInfoType = 0;
    let { res } = (await webapi.fetchGoodsPage(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      let goodsPage = res.context.goodsPage;
      let brands = res.context.goodsBrandList;
      let storeCates = this.props.cates.toJS();
      let goodsInfoSpecDetails = res.context.goodsInfoSpecDetails;
      let goodsInfos = res.context.goodsInfoList;
      goodsInfos = goodsInfos ? goodsInfos : [];

      // 3.设置单品列表
      goodsInfos = goodsInfos.map((item) => {
        // 设品牌名称
        const brand = brands.find((i) => i.brandId == item.brandId);
        if (brand) {
          item.brandName = brand.brandName;
        }
        // 设规格字符串
        item.specText = goodsInfoSpecDetails
          .filter((i) => item.specDetailRelIds.includes(i.specDetailRelId))
          .map((item) => item.detailName)
          .join(' ');
        return item;
      });

      // 4.设置商品列表
      goodsPage.content.forEach((item) => {
        // 设品牌名称
        const brand = brands.find((i) => i.brandId == item.brandId);
        if (brand) {
          item.brandName = brand.brandName;
        }
        // 设店铺分类
        item.cateName = item.storeCateIds
          .map((item) => {
            const storeCate = storeCates.find((i) => i.storeCateId == item);
            if (storeCate) {
              return storeCate.cateName;
            } else {
              return '';
            }
          })
          .join('，');
      });

      // 4.设值
      this.setState({ goodsPage, goodsInfos });
    }
    this.setState({ loading: false });
  };

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (cateList, cateParentId) =>
    cateList
      .filter((cate) => cate.get('cateParentId') === cateParentId)
      .map((item) => {
        const childCates = cateList.filter(
          (cate) => cate.get('cateParentId') == item.get('storeCateId')
        );
        if (childCates && childCates.count()) {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            >
              {this.loop(childCates, item.get('storeCateId'))}
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
}
