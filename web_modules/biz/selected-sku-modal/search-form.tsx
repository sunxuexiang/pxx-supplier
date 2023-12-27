import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup, util } from 'qmkit';

import * as webapi from './webapi';

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

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      brands: [],
      searchParams: {
        brandId: 0,
        cateId: 0,
        likeValue: '',
        likeGoodsName: '',
        goodsInfoType: '',
        wareId: props.wareId,
        erpGoodsInfoNo: '',
      },
      likeType: LIKE_TYPE.LIKE_GOODS_INFO_NO
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          brandId: 0,
          cateId: 0,
          likeValue: '',
          likeGoodsName: '',
          goodsInfoType: '',
          erpGoodsInfoNo: '',
          wareId: nextProps.wareId
        }
      });
    }
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
    const { searchParams } = this.state;
    const { cates, brands } = this.state;
    const { needHide } = this.props;
    // console.log(searchParams,'searchParamssearchParams');
    
    const wareHouseVOPage =
      JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    const isThird = util.isThirdStore();
    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem style={needHide && isThird ? {display: 'none'} : {}}>
            <div style={{ marginBottom: 16 }}>
              <Input
                addonBefore={this.goodsOptionSelect()}
                value={searchParams.likeValue}
                onChange={(e) =>
                  this.paramsOnChange('likeValue', e.target.value)
                }
              />
            </div>
          </FormItem>
          {/* 商家入驻需求 第三方商家此处需隐藏并设置disable*/}
          <FormItem style={needHide && isThird ? {display: 'none'} : {}}>
            <Input
              addonBefore="ERP编码"
              value={searchParams.erpGoodsInfoNo}
              disabled={needHide && isThird}
              onChange={(e) =>
                this.paramsOnChange('erpGoodsInfoNo', e.target.value)
              }
            />
          </FormItem>

          <FormItem>
            <Input
              addonBefore="商品名称"
              value={searchParams.likeGoodsName}
              onChange={(e) =>
                this.paramsOnChange('likeGoodsName', e.target.value)
              }
            />
          </FormItem>
          <FormItem style={needHide && isThird ? {display: 'none'} : {}}>
            <SelectGroup
              getPopupContainer={() =>
                document.getElementById('modal-head')
              }
              label="商品类型"
              value={searchParams.goodsInfoType}
              showSearch
              onChange={value =>
                this.paramsOnChange('goodsInfoType', value)
              }
            >
              <Option value="">全部</Option>
              <Option value="1">特价商品</Option>
              <Option value="0">普通商品</Option>
            </SelectGroup>
          </FormItem>
          {/* 商家入驻需求 此处需隐藏并设置disable 默认值 null（全部） */}
          <FormItem style={needHide ? {display: 'none'} : {}}>
            <SelectBox>
              <SelectGroup
                // mode="multiple"
                getPopupContainer={() => document.getElementById('page-content')}
                label="适用区域"
                value={searchParams.wareId}
                disabled
                // defaultValue={wareHouseVOPage[0].wareId}
                showSearch
                onChange={(value) => {
                  // console.log(value, 'valuevaluevalue');
                  // value[0] = value[0] == '0' ? 0 : value[0]
                  this.paramsOnChange('wareId', value)
                }}
              >
                {wareHouseVOPage.map((ware) => {
                  return <Option value={ware.wareId}>{ware.wareName}</Option>;
                })}
              </SelectGroup>
            </SelectBox>
          </FormItem>

          <FormItem style={needHide && isThird ? {display: 'none'} : {}}>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="分类"
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(value) => this.paramsOnChange('cateId', value)}
              value={searchParams.cateId.toString()}
            >
              <TreeNode key="0" value="0" title="全部">
                {this.loop(fromJS(cates), fromJS(cates), 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>

          <FormItem style={needHide && isThird ? {display: 'none'} : {}}>
            <SelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label="品牌"
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(val) => this.paramsOnChange('brandId', val)}
              value={searchParams.brandId.toString()}
            >
              <Option key="0" value="0">
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

  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams: searchParams });
  };

  searchBackFun = () => {
    const { searchParams, likeType } = this.state;
    let { likeValue, ...rest } = searchParams;
    rest[
      likeType == LIKE_TYPE.LIKE_GOODS_INFO_NO
        ? LIKE_TYPE.LIKE_GOODS_INFO_NO
        : LIKE_TYPE.LIKE_GOODS_NO
    ] = likeValue;
    this.props.searchBackFun(rest);
  };

  goodsOptionSelect = () => (
    <Select
      value={this.state.likeType}
      style={{ width: 100 }}
      onChange={(val) => {
        this.setState({ likeType: val });
      }}
      getPopupContainer={() => document.getElementById('modal-head')}
    >
      <Option value={LIKE_TYPE.LIKE_GOODS_NO}>SPU编码</Option>
      <Option value={LIKE_TYPE.LIKE_GOODS_INFO_NO}>SKU编码</Option>
    </Select>
  );
}
