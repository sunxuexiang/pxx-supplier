import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button } from 'antd';
import { noop } from 'qmkit';
import { IndicatorPopver, DownloadModal } from 'biz';

const FormItem = Form.Item;

//业务员业绩报表默认展示的列
const defalutAchieveColumns = [
  { title: '下单笔数', key: 'orderCount' },
  { title: '下单人数', key: 'customerCount' },
  { title: '下单金额', key: 'amount' },
  { title: '付款订单数', key: 'payCount' },
  { title: '付款人数', key: 'payCustomerCount' },
  { title: '付款金额', key: 'payAmount' }
];

//自定义指标卡片显示的内容
const popContent = [
  {
    title: '下单指标',
    data: [
      { title: '下单笔数', key: 'orderCount' },
      { title: '下单人数', key: 'customerCount' },
      { title: '下单金额', key: 'amount' },
      { title: '付款订单数', key: 'payCount' },
      { title: '付款人数', key: 'payCustomerCount' },
      { title: '付款金额', key: 'payAmount' },
      { title: '客单价', key: 'customerUnitPrice' },
      { title: '笔单价', key: 'orderUnitPrice' }
    ]
  },
  {
    title: '退单指标',
    data: [
      { title: '退单笔数', key: 'returnCount' },
      { title: '退单人数', key: 'returnCustomerCount' },
      { title: '退单金额', key: 'returnAmount' }
    ]
  }
];

@Relax
export default class AchieveSearch extends React.Component<any, any> {
  props: {
    relaxProps?: {
      searchKeyWords: Function;
      changeColumns: Function;
      achieveColumns: any;
      achieveEmployeeName: string;
      changeAchieveEmployeeName: Function;
      achieveVisible: boolean;
      hideAchieveModal: Function;
      showAchieveModal: Function;
    };
  };

  static relaxProps = {
    searchKeyWords: noop,
    changeColumns: noop,
    achieveColumns: 'achieveColumns',
    achieveEmployeeName: 'achieveEmployeeName',
    changeAchieveEmployeeName: noop,
    achieveVisible: 'achieveVisible',
    hideAchieveModal: noop,
    showAchieveModal: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      searchKeyWords,
      achieveEmployeeName,
      changeAchieveEmployeeName,
      changeColumns,
      achieveColumns
    } = this.props.relaxProps;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            placeholder="输入业务员姓名查看"
            addonBefore="业务员查看"
            onChange={(e) => changeAchieveEmployeeName((e.target as any).value)}
            value={achieveEmployeeName}
          />
        </FormItem>
        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              searchKeyWords(1);
            }}
          >
            搜索
          </Button>
        </FormItem>
        <FormItem>
          <IndicatorPopver
            popContent={popContent}
            maxCheckedCount={6}
            selfIndicators={defalutAchieveColumns}
            onSubmit={(value) => changeColumns(value)}
            checkedArray={achieveColumns}
          />
        </FormItem>
        <FormItem>
          <DownloadModal visible={false} reportType={9} />
        </FormItem>
      </Form>
    );
  }
}
