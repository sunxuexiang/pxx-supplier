import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { AuthWrapper, SelectGroup } from 'qmkit';
import { noop, Const } from 'qmkit';
import { Link } from 'react-router-dom';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 订单查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      setField: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    setField: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { setField, onSearch } = this.props.relaxProps;

    return (
      <div>
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="小视频名称"
                onChange={(e) => {
                  setField({ field: 'videoName', value: e.target.value });
                }}
              />
            </FormItem>

            <FormItem>
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                placeholder={['发布开始时间', '发布结束时间']}
                onChange={(e) => {
                  let beginTime = '';
                  let endTime = '';
                  if (e.length > 0) {
                    beginTime = e[0].format(Const.DAY_FORMAT);
                    endTime = e[1].format(Const.DAY_FORMAT);
                    if (beginTime) {
                      beginTime = beginTime + ' 00:00:00';
                    }
                    if (endTime) {
                      endTime = endTime + ' 23:59:59';
                    }
                  }
                  setField({ field: 'createTimeBegin', value: beginTime });
                  setField({ field: 'createTimeEnd', value: endTime });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                defaultValue="all"
                label="状态"
                onChange={(value) => {
                  setField({ field: 'state', value: value });
                }}
              >
                <Option value="all">全部</Option>
                <Option value="0">上架</Option>
                <Option value="1">下架</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  onSearch();
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>
          <AuthWrapper functionName={'f_video_upload'}>
            <Link to={'/video-create/-1'} style={{ marginRight: 10 }}>
              <Button type="primary" onClick={() => {}}>
                发布
              </Button>
            </Link>
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
