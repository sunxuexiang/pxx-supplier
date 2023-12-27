import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
import { noop } from 'qmkit';
import { DownloadModal } from 'biz';

const FormItem = Form.Item;

@Relax
export default class ClientSearch extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchKeyWords: Function;
      clientEmployeeName: string;
      changeClientEmployeeName: Function;
      clientVisible: boolean;
      hideClientModal: Function;
      showClientModal: Function;
    };
  };

  static relaxProps = {
    searchKeyWords: noop,
    clientEmployeeName: 'clientEmployeeName',
    changeClientEmployeeName: noop,
    clientVisible: 'clientVisible',
    hideClientModal: noop,
    showClientModal: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      searchKeyWords,
      clientEmployeeName,
      changeClientEmployeeName
    } = this.props.relaxProps;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            placeholder="输入业务员姓名查看"
            addonBefore="业务员查看"
            onChange={(e) => changeClientEmployeeName((e.target as any).value)}
            value={clientEmployeeName}
          />
        </FormItem>
        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              searchKeyWords(2);
            }}
          >
            搜索
          </Button>
        </FormItem>
        <FormItem>
          <DownloadModal visible={false} reportType={10} />
        </FormItem>
      </Form>
    );
  }
}
