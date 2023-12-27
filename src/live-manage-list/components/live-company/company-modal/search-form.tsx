import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree, DatePicker } from 'antd';
import { TreeSelectGroup, SelectGroup } from 'qmkit';

import * as webapi from './webapi';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {
        activityName: '',
        startTime: '',
        endTime: ''
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          activityName: '',
          startTime: '',
          endTime: ''
        }
      });
    }
  }

  render() {
    const { searchParams } = this.state;

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <div>
              <Input
                addonBefore="活动名称"
                value={searchParams.activityName}
                onChange={(e) =>
                  this.paramsOnChange('activityName', e.target.value)
                }
              />
            </div>
          </FormItem>

          <FormItem>
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={(value, dateString) => {
                if (dateString.length) {
                  this.paramsOnChange('startTime', dateString[0]);
                  this.paramsOnChange('endTime', dateString[1]);
                } else {
                  this.paramsOnChange('startTime', '');
                  this.paramsOnChange('endTime', '');
                }
              }}
            />
          </FormItem>

          <Button
            type="primary"
            icon="search"
            htmlType="submit"
            onClick={() => this.searchBackFun()}
          >
            搜索
          </Button>
        </Form>
      </div>
    );
  }

  init = async () => {};

  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams: searchParams });
  };

  searchBackFun = () => {
    const { searchParams, likeType } = this.state;
    let { likeValue, ...rest } = searchParams;
    this.props.searchBackFun(rest);
  };
}
