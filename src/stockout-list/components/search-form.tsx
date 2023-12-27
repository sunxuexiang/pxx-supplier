import React from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { Relax } from 'plume2';
import { noop, Const, SelectGroup } from 'qmkit';
import styled from 'styled-components';
import { IList } from '../../../typings/globalType';
import AreaTwoSelect from '../areas/area-two-select';

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
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      goodsBrandList: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    goodsBrandList: 'goodsBrandList'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch, goodsBrandList } = this.props.relaxProps;
    // console.log(JSON.stringify(goodsBrandList))
    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'商品名称'}
              onChange={(e) => {
                this.setState({
                  goodsName: e.target.value
                });
              }}
            />
          </FormItem>

          <FormItem>
            <Input
              addonBefore={'SKU编码'}
              onChange={(e) => {
                this.setState({
                  goodsInfoNo: e.target.value
                });
              }}
            />
          </FormItem>

          {/*省市区*/}
          <FormItem>
            <AreaTwoSelect
              label="缺货地区"
              getPopupContainer={() => document.getElementById('page-content')}
              onChange={(value) => {
                this.setState({
                  stockoutCity: value[1]
                });
              }}
            />
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
                  this.setState({
                    brandId: value
                  });
                }}
              >
                <Option key="-1" value="">
                  全部
                </Option>
                {goodsBrandList.map((v, i) => {
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
              type="primary"
              icon="search"
              onClick={() => {
                const params = this.state;
                onSearch(params);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
