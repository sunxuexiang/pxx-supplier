import React from 'react';

import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input, Select,Tree  } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import styled from 'styled-components';
import { fromJS } from 'immutable';

const TreeNode = Tree.TreeNode;


// const Option = Select.Option;

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      cateList:IList;
      brandsList:IList;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    cateList:'cateList',
    brandsList:'brandsList',
    onFormFieldChange: noop,
    search: noop
  };





  render() {
    const { form, onFormFieldChange, search,cateList,brandsList } =
      this.props.relaxProps;
          //处理分类的树形图结构数据
    const loop = (cateList) =>
        cateList.map((item) => {
          if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
            return (
              <TreeNode
                key={item.get('cateId')}
                value={item.get('cateId')}
                title={item.get('cateName')}
              >
                {loop(item.get('goodsCateList'))}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            />
          );
    });
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="ERP编码"
            value={form.get('likeErpNo')}
            onChange={(e: any) => {
              onFormFieldChange('likeErpNo', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Input
            addonBefore="商品名称"
            value={form.get('likeGoodsName')}
            onChange={(e: any) => {
              onFormFieldChange('likeGoodsName', e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
        <TreeSelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="平台类目"
              style={{ width: 180 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              defaultValue=""
              onChange={(value) => {
                onFormFieldChange('cateId', value);
              }}
            >
              <TreeNode key="-1" value="" title="全部">
                {loop(cateList)}
              </TreeNode>
            </TreeSelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="品牌"
            defaultValue=""
            onChange={(value) => {
              onFormFieldChange('brandId', value);
            }}
          >
            <Select.Option key="" value="">全部</Select.Option>
            {
              brandsList.toJS().map((item,i)=>
                <Select.Option key={i} value={item.brandId}>
                  {item.brandName}
                </Select.Option>
              )
            }
          </SelectGroup>
        </FormItem>

        {/* <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="目标客户"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('joinLevel', value);
            }}
          >
            <Select.Option key="-3" value="-3">
              不限
            </Select.Option>
            <Select.Option key="-1" value="-1">
              {util.isThirdStore() ? '全部客户' : '全平台客户'}
            </Select.Option>
            {util.isThirdStore() && (
              <Select.Option key="0" value="0">
                全部等级
              </Select.Option>
            )}
            {levelList &&
              levelList.map((item) => {
                return (
                  <Select.Option key={item.get('key')} value={item.get('key')}>
                    {item.get('value')}
                  </Select.Option>
                );
              })}
            <Select.Option key="-2" value="-2">
              指定客户
            </Select.Option>
          </SelectGroup>
        </FormItem> */}

  

        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

 






}
