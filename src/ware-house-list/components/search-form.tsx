import React from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import AddWarehouse from './add-warehouse';
import AppStore from '../store';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  store: AppStore;

  props: {
    relaxProps?: {
      onSearch: Function;
      init: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    init: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      showWareHouse: false
    };
  }
  refreshData = () => {
    console.warn('刷新');
    this.props.relaxProps.init();
  };
  render() {
    const { onSearch } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'仓库名称'}
              onChange={(e) => {
                this.setState({
                  wareName: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore={'仓库编码'}
              onChange={(e) => {
                this.setState({
                  wareCode: e.target.value
                });
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
          <FormItem>
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                this.setState({ showWareHouse: true });
              }}
            >
              新增仓库
            </Button>
          </FormItem>
        </Form>
        <AddWarehouse
          visible={this.state.showWareHouse}
          hide={(isRefresh) => {
            this.setState({ showWareHouse: false });
            if (isRefresh) {
              this.refreshData();
            }
          }}
        />
      </div>
    );
  }
}
