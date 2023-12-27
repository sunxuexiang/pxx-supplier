import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree } from 'antd';
import {
  noop,
  SelectGroup,
  TreeSelectGroup,
  InputGroupCompact,
  AuthWrapper
} from 'qmkit';
import { IList } from 'typings/globalType';
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
const { Option } = Select;
const TreeNode = Tree.TreeNode;

/**
 * 商品搜索项
 * @type {{"0": string; "1": string}}
 */
const GOODS_OPTION_TYPE = {
  0: 'likeGoodsName',
  1: 'likeGoodsInfoNo'
};

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      onSearch: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      onChooseSkuModal: Function;
    };
  };

  static relaxProps = {
    // 查询条件form
    form: 'form',
    onSearch: noop,
    onFormFieldChange: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    // 添加分销商品选择商品弹窗
    onChooseSkuModal: noop
  };

  render() {
    const {
      form,
      onSearch,
      onFormFieldChange,
      brandList,
      cateList,
      onChooseSkuModal
    } = this.props.relaxProps;

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

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={this._buildGoodsOptions()}
              value={
                form.get('optGoodsType') == 0
                  ? form.get('likeGoodsName')
                  : form.get('likeGoodsInfoNo')
              }
              onChange={(e: any) => {
                onFormFieldChange({
                  key: GOODS_OPTION_TYPE[form.get('optGoodsType')],
                  value: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="店铺分类"
              /*defaultValue="全部"*/
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              defaultValue={-1}
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
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="上下架"
              defaultValue="全部"
              onChange={(value) => {
                onFormFieldChange({ key: 'addedFlag', value });
              }}
            >
              <Option key="" value="">
                全部
              </Option>
              <Option key="0" value="0">
                下架
              </Option>
              <Option key="1" value="1">
                上架
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="门店价"
              precision={2}
              startMin={0}
              start={form.get('salePriceFirst')}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'salePriceFirst', value: val })
              }
              endMin={0}
              end={form.get('salePriceLast')}
              onEndChange={(val) =>
                onFormFieldChange({ key: 'salePriceLast', value: val })
              }
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="佣金比例"
              startMin={0}
              startMax={99}
              start={form.get('commissionRateFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'commissionRateFirst',
                  value: val
                })
              }
              endMin={0}
              endMax={99}
              end={form.get('commissionRateLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'commissionRateLast',
                  value: val
                })
              }
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="预估佣金"
              precision={2}
              startMin={0}
              start={form.get('distributionCommissionFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'distributionCommissionFirst',
                  value: val
                })
              }
              endMin={0}
              end={form.get('distributionCommissionLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'distributionCommissionLast',
                  value: val
                })
              }
            />
          </FormItem>
          <FormItem>
            <InputGroupCompact
              title="库存"
              startMin={0}
              start={form.get('stockFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'stockFirst',
                  value: val
                })
              }
              endMin={0}
              end={form.get('stockLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'stockLast',
                  value: val
                })
              }
            />
          </FormItem>
          <FormItem>
            {/*<InputGroupCompact
              title="分销销量"
              startMin={0}
              start={form.get('distributionSalesCountFirst')}
              onStartChange={(val) =>
                onFormFieldChange({
                  key: 'distributionSalesCountFirst',
                  value: val
                })
              }
              endMin={0}
              end={form.get('distributionSalesCountLast')}
              onEndChange={(val) =>
                onFormFieldChange({
                  key: 'distributionSalesCountLast',
                  value: val
                })
              }
            />*/}
          </FormItem>
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
        </Form>
        <AuthWrapper functionName={'f_distribution_goods_edit'}>
          <div className="handle-bar">
            <Button type="primary" onClick={() => onChooseSkuModal(true)}>
              添加分销商品
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 构建商品Option结构
   */
  _buildGoodsOptions = () => {
    const { form, onFormFieldChange } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optGoodsType')}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => {
          onFormFieldChange({ key: 'optGoodsType', value: val });
        }}
      >
        <Option value="0">商品名称</Option>
        <Option value="1">SKU编码</Option>
      </Select>
    );
  };
}
