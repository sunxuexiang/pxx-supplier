import * as React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup,noop } from 'qmkit';

import * as webapi from '../webapi';

import styled from 'styled-components';

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
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

enum LIKE_TYPE {
  LIKE_GOODS_NO = 'likeGoodsNo',
  LIKE_GOODS_INFO_NO = 'likeGoodsInfoNo'
}
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSeachFormBut: Function;
      searchForm: any;
      init:Function;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      brands: [],
      likeType: LIKE_TYPE.LIKE_GOODS_INFO_NO
    };
  }

  static relaxProps = {
    onSeachFormBut: noop,
    init:noop,
    searchForm: 'searchForm',
  };

  componentDidMount() {
    this.init();
  }



  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) =>
    cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter(
          (cate) => cate.get('cateParentId') == item.get('cateId')
        );
        if (childCates && childCates.count()) {
          return (
            <TreeNode
              key={item.get('cateId').toString()}
              value={item.get('cateId').toString()}
              title={item.get('cateName').toString()}
            >
              {this.loop(oldCateList, childCates, item.get('cateId'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId').toString()}
            value={item.get('cateId').toString()}
            title={item.get('cateName').toString()}
          />
        );
      });

  render() {
    const { cates, brands } = this.state;
    const {searchForm,onSeachFormBut}=this.props.relaxProps;
    const wareHouseVOPage = JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <div style={{ marginBottom: 16 }}>
              <Input
                addonBefore={this.goodsOptionSelect()}
                value={searchForm.get(this.state.likeType)}
                onChange={(e) =>
                  onSeachFormBut(this.state.likeType, e.target.value)
                }
              />
            </div>
          </FormItem>

          <FormItem>
            <Input
              addonBefore="ERP编码"
              value={searchForm.get('erpGoodsInfoNo')}
              onChange={(e) =>
                onSeachFormBut('erpGoodsInfoNo', e.target.value)
              }
            />
          </FormItem>

          <FormItem>
            <Input
              addonBefore="商品名称"
              value={searchForm.get('likeGoodsName')}
              onChange={(e) =>
                onSeachFormBut('likeGoodsName', e.target.value)
              }
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() =>
                document.getElementById('modal-head')
              }
              label="商品类型"
              value={searchForm.get('goodsInfoType')}
              showSearch
              onChange={value =>
                onSeachFormBut('goodsInfoType', value)
              }
            >
              <Option value="">全部</Option>
              <Option value="1">特价商品</Option>
              <Option value="0">普通商品</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectBox>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label="适用区域"
                value={searchForm.get('wareId')}
                disabled
                showSearch
                onChange={(value) => {
                  onSeachFormBut('wareId', value)
                }}
              >
                {wareHouseVOPage.map((ware) => {
                  return <Option value={ware.wareId} key={ware.wareId}>{ware.wareName}</Option>;
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>

          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="分类"
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(value) => onSeachFormBut('cateId', value)}
              value={String(searchForm.get('cateId'))}
            >
              <TreeNode key="0" value="" title="全部">
                {this.loop(fromJS(cates), fromJS(cates), 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>

          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="品牌"
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(val) => onSeachFormBut('brandId', val)}
              value={String(searchForm.get('brandId'))}
            >
              <Option key="0" value="">
                全部
              </Option>
              {brands.map((v) => (
                <Option key={v.brandId} value={v.brandId + ''}>
                  {v.brandName}
                </Option>
              ))}
            </SelectGroup>
          </FormItem>

          <Button
            type="primary"
            icon="search"
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              this.searchBackFun();
            }}
          >
            搜索
          </Button>
        </Form>
      </div>
    );
  }

  init = async () => {
    const fetchBrand = await webapi.fetchBrandList();
    const fetchCates = await webapi.fetchCateList();
    const { res: brandsRes } = fetchBrand as any;
    const { context: brands } = brandsRes;
    const { res: catesRes } = fetchCates as any;
    const { context: cates } = catesRes;

    this.setState({ brands: brands, cates: cates });
  };
  searchBackFun = () => {
    this.props.relaxProps.init();
  };

  goodsOptionSelect = () => (
    
    <Select
      value={this.state.likeType}
      style={{ width: 100 }}
      onChange={(val) => {
        this.props.relaxProps.onSeachFormBut(this.state.likeType, '')
        this.setState({ likeType: val });
      }}
      getPopupContainer={() => document.getElementById('modal-head')}
    >
      <Option value={LIKE_TYPE.LIKE_GOODS_NO}>SPU编码</Option>
      <Option value={LIKE_TYPE.LIKE_GOODS_INFO_NO}>SKU编码</Option>
    </Select>
  );
}
