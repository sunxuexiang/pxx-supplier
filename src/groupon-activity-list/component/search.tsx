import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Input, Button, Form, DatePicker } from 'antd';

import { noop, Const, history, AuthWrapper, SelectGroup } from 'qmkit';
import { List } from 'immutable';

type TList = List<IMap>;
const FormItem = Form.Item;

@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      setFormField: Function;
      init: Function;
      grouponCateIdList: TList;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    init: noop,
    setFormField: noop,
    grouponCateIdList: 'grouponCateIdList'
  };
  state = {
    startValue: null,
    endValue: null
  };
  render() {
    const {
      form,
      setFormField,
      init,
      grouponCateIdList
    } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    const { goodsName } = form.toJS();
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="商品名称"
              value={goodsName}
              onChange={(e: any) => setFormField('goodsName', e.target.value)}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="拼团分类"
              style={{ width: 80 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                setFormField('grouponCateId', value);
              }}
            >
              <Option value="">全部</Option>
              {grouponCateIdList &&
                grouponCateIdList.map(
                  (v, index) =>
                    index && (
                      <Option
                        key={v.get('grouponCateId').toString()}
                        value={v.get('grouponCateId').toString()}
                      >
                        {v.get('grouponCateName')}
                      </Option>
                    )
                )}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <DatePicker
              allowClear={true}
              disabledDate={this._disabledStartDate}
              format={Const.DAY_FORMAT}
              value={startValue}
              placeholder="开始时间"
              onChange={this._onStartChange}
              showToday={false}
            />
          </FormItem>

          <FormItem>
            <DatePicker
              allowClear={true}
              disabledDate={this._disabledEndDate}
              format={Const.DAY_FORMAT}
              value={endValue}
              placeholder="结束时间"
              onChange={this._onEndChange}
              showToday={false}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={(e) => {
                e.preventDefault();
                init();
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <div style={{ marginBottom: 16 }}>
          <AuthWrapper functionName="f_create_groupon_activity">
            <Button type="primary" onClick={() => history.push('/groupon-add')}>
              添加拼团
            </Button>
          </AuthWrapper>
        </div>
      </div>
    );
  }

  _onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  _disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  _disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  _onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { setFormField } = this.props.relaxProps;
    setFormField('startTime', time);
    setFormField('startValue', value);
    this._onChange('startValue', value);
  };

  _onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { setFormField } = this.props.relaxProps;
    setFormField('endTime', time);
    setFormField('endValue', value);
    this._onChange('endValue', value);
  };
}
