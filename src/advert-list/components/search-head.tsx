import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect
} from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { history, SelectGroup, Const } from 'qmkit';
import { MyRangePicker } from 'biz';

const FormItem = Form.Item;
const SearchHead = forwardRef((props: any, ref) => {
  const { form, pageChange } = props;
  const { getFieldDecorator } = form;
  useImperativeHandle(ref, () => ({
    form
  }));
  return (
    <Form layout="inline">
      <FormItem>
        {getFieldDecorator('slotType', {
          initialValue: -1
        })(
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="广告类型"
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
          >
            <Select.Option value={-1}>全部</Select.Option>
            <Select.Option value={0}>开屏广告</Select.Option>
            <Select.Option value={1}>banner广告</Select.Option>
            <Select.Option value={2}>商城广告</Select.Option>
          </SelectGroup>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('activityState', {
          initialValue: -1
        })(
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="投放状态"
            showSearch
            filterOption={(input, option: any) =>
              option.props.children.indexOf(input) >= 0
            }
          >
            <Select.Option value={-1}>全部</Select.Option>
            <Select.Option value={0}>待支付</Select.Option>
            <Select.Option value={10}>待审核</Select.Option>
            <Select.Option value={20}>待履行</Select.Option>
            <Select.Option value={30}>履行中</Select.Option>
            <Select.Option value={40}>已驳回</Select.Option>
            <Select.Option value={50}>已取消</Select.Option>
            <Select.Option value={100}>已完成</Select.Option>
          </SelectGroup>
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('submitTime', {
          initialValue: []
        })(
          <MyRangePicker
            title="提交时间"
            getCalendarContainer={() => document.getElementById('page-content')}
          />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('startTime', {
          initialValue: []
        })(
          <MyRangePicker
            title="投放生效时间"
            getCalendarContainer={() => document.getElementById('page-content')}
          />
        )}
      </FormItem>
      <FormItem>
        <Button icon="search" type="primary" onClick={() => pageChange()}>
          搜索
        </Button>
      </FormItem>
      <FormItem>
        <Button
          icon="plus"
          type="primary"
          onClick={() => history.push('/advert')}
        >
          新增广告
        </Button>
      </FormItem>
    </Form>
  );
});

const SearchHeadForm = Form.create<any>()(SearchHead);
export default SearchHeadForm;
