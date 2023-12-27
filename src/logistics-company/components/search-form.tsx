import React from 'react';
import { Button, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    urlType: number;
    relaxProps?: {
      onSearch: Function;
    };
  };

  static relaxProps = {
    onSearch: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { urlType } = this.props;
    const { onSearch } = this.props.relaxProps;

    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          {/* <FormItem>
            <Input
              addonBefore={'物流公司编号'}
              onChange={(e) => {
                this.setState({
                  companyNumber: e.target.value
                });
              }}
            />
          </FormItem> */}
          <FormItem>
            <Input
              addonBefore={urlType === 1 ? '指定专线名称' : '物流公司名称'}
              onChange={(e) => {
                this.setState({
                  logisticsName: e.target.value
                });
              }}
            />
          </FormItem>
          {/*<FormItem>
            <Input
              addonBefore={'公司电话'}
              onChange={(e) => {
                this.setState({
                  logisticsPhone: e.target.value
                });
              }}
            />
          </FormItem>*/}
          {/*<FormItem>
            <Input
              addonBefore={'物流公司地址'}
              onChange={(e) => {
                this.setState({
                  logisticsAddress: e.target.value
                });
              }}
            />
          </FormItem>*/}
          {/*<FormItem>
            <RangePicker
              getCalendarContainer={() =>
                  document.getElementById('page-content')
              }
              format={Const.TIME_FORMAT}
              showTime={true}
              placeholder={['创建时间开始', '创建时间截止']}
              onChange={(date, dateStr) => {
                let createTimeBegin = null;
                let createTimeEnd = null;
                if (date.length > 0) {
                  createTimeBegin = dateStr[0];
                  createTimeEnd = dateStr[1];
                }
                this.setState({ createTimeBegin, createTimeEnd });
              }}
            />
          </FormItem>*/}
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
