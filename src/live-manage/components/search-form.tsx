import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import { noop, SelectGroup, util } from 'qmkit';

const FormItem = Form.Item;
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
// const { Option } = Select;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onFormFieldChange: Function;
      searchData: IMap;
      companyCates: IList;
      brandCates: IList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    onFormFieldChange: noop,
    searchData: 'searchData',
    companyCates: 'companyCates',
    brandCates: 'brandCates'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onSearch,
      onFormFieldChange,
      searchData,
      companyCates,
      brandCates
    } = this.props.relaxProps;
    const isThird = util.isThirdStore();
    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'直播间名称'}
              value={searchData.get('liveRoomName')}
              onChange={(e) => {
                onFormFieldChange('liveRoomName', e.target.value);
              }}
            />
          </FormItem>
          {!isThird && (
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  label="厂商"
                  defaultValue={null}
                  showSearch
                  value={searchData.get('companyId')}
                  onChange={(value) => {
                    onFormFieldChange('companyId', value);
                  }}
                >
                  <Select.Option key="0" value={null}>
                    全部
                  </Select.Option>
                  {companyCates.toJS().map((v, i) => {
                    return (
                      <Select.Option key={i + 1} value={Number(v.companyId)}>
                        {v.companyName}
                      </Select.Option>
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
                  label="品牌"
                  defaultValue={null}
                  showSearch
                  value={searchData.get('brandId')}
                  onChange={(value) => {
                    onFormFieldChange('brandId', value);
                  }}
                >
                  <Select.Option key="0" value={null}>
                    全部
                  </Select.Option>
                  {brandCates.toJS().map((v, i) => {
                    return (
                      <Select.Option key={i + 1} value={Number(v.brandId)}>
                        {v.brandName}
                      </Select.Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
            </FormItem>
          )}
          <FormItem>
            <Input
              addonBefore={'直播账号'}
              value={searchData.get('accountName')}
              onChange={(e) => {
                onFormFieldChange('accountName', e.target.value);
              }}
            />
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
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
}
