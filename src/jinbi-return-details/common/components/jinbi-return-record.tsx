import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Form, Input, Button } from 'antd';
import { exportRecords } from '../../webapi';
import moment from 'moment';

const FormItem = Form.Item;
const Column = DataGrid.Column;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      activityId: String;
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      getRecordInfo: Function;
      onFormFieldChange: Function;
      search: Function;
    };
  };

  state = {
    isExport: false
  };

  static relaxProps = {
    total: 'total',
    form: 'form',
    activityId: 'activityId',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    getRecordInfo: noop,
    onFormFieldChange: noop,
    search: noop
  };

  /**
   * 批量导出
   */
  bulk_export = async () => {
    const { activityId, form } = this.props.relaxProps;
    const query = form.toJS();
    this.setState({ isExport: true });
    let res = await exportRecords({ ...query, activityId });
    this.setState({ isExport: false });
    if (res.size) {
      let blob = new Blob([res], { type: res.type });
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', '返鲸币活动领取记录.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击
    }
  };

  render() {
    const { isExport } = this.state;
    const {
      form,
      total,
      pageNum,
      pageSize,
      couponList,
      getRecordInfo,
      search,
      onFormFieldChange
    } = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="用户账号"
              placeholder="请输入用户账号"
              value={form.get('customerAccount')}
              onChange={(e: any) => {
                onFormFieldChange('customerAccount', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="订单编号"
              placeholder="请输入订单编号"
              value={form.get('orderNo')}
              onChange={(e: any) => {
                onFormFieldChange('orderNo', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
              onClick={() => {
                search();
              }}
            >
              搜索
            </Button>
          </FormItem>
          <FormItem>
            <div style={{ paddingBottom: '16px' }}>
              <Button
                type="primary"
                loading={isExport}
                onClick={() => this.bulk_export()}
              >
                导出
              </Button>
            </div>
          </FormItem>
        </Form>
        <DataGrid
          rowKey={(record) => record.recordId}
          dataSource={couponList.toJS()}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (pageNum, pageSize) => {
              getRecordInfo({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            title="用户账号"
            dataIndex="customerAccount"
            key="customerAccount"
            width="20%"
          />
          <Column
            title="订单编号"
            dataIndex="orderNo"
            key="orderNo"
            width="20%"
          />
          <Column
            title="下单时间"
            dataIndex="orderTime"
            key="orderTime"
            width="20%"
            render={(text) => {
              return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }}
          />
          <Column
            title="订单金额"
            dataIndex="orderPrice"
            key="orderPrice"
            width="20%"
          />
          <Column
            title="返还金额"
            dataIndex="coinNum"
            key="coinNum"
            width="20%"
          />
        </DataGrid>
      </div>
    );
  }
}
