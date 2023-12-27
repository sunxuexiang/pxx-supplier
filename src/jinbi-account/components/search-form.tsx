import React, { useImperativeHandle, forwardRef } from 'react';

import { Form, Input, Select, Button } from 'antd';
import { SelectGroup } from 'qmkit';
import { FormComponentProps } from 'antd/lib/form/Form';
import { orList, modalList, noLinkList } from './optionsList';

const FormItem = Form.Item;
const { Option } = Select;

interface SearchFormProps extends FormComponentProps {
  getList: () => void;
}

const Search = forwardRef(({ form, getList }: SearchFormProps, ref) => {
  const { getFieldDecorator } = form;
  useImperativeHandle(ref, () => ({
    form
  }));
  return (
    <Form layout="inline" className="ja-detail-form">
      <FormItem>
        {getFieldDecorator('budgetType', {
          initialValue: null
        })(
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="金额类型"
            showSearch
            optionFilterProp="children"
          >
            <Option key="-1" value={null}>
              全部
            </Option>
            <Option key="0" value={0}>
              获得
            </Option>
            <Option key="1" value={1}>
              扣除
            </Option>
          </SelectGroup>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('remark', {
          initialValue: ''
        })(
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="明细类型"
            showSearch
            optionFilterProp="children"
          >
            <Option key="-1" value="">
              全部
            </Option>
            {[...noLinkList, ...orList, ...modalList].map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </SelectGroup>
        )}
      </FormItem>
      {/* <FormItem>
        {getFieldDecorator('accountNumber', {
          initialValue: ''
        })(<Input addonBefore="相关账号" />)}
      </FormItem> */}
      <FormItem>
        <Button icon="search" type="primary" onClick={() => getList()}>
          搜索
        </Button>
      </FormItem>
    </Form>
  );
});

const SearchForm = Form.create<SearchFormProps>()(Search);
export default SearchForm;
