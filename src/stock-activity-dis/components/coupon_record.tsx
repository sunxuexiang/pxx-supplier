import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Popconfirm, Form, Input, Button } from 'antd';

const FormItem = Form.Item;


@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      total: number;
      pageNum: number;
      pageSize: number;
      couponList: IList;
      deleteCoupon: Function;
      inits: Function;
      onFormFieldChange: Function;
      copyCoupon: Function;
      search: Function;
      bulk_export: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    form: 'form',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponList: 'couponList',
    deleteCoupon: noop,
    inits: noop,
    onFormFieldChange: noop,
    bulk_export: noop,
    copyCoupon: noop,
    search: noop
  };

  render() {
    const {
      form,
      total,
      pageNum,
      pageSize,
      couponList,
      deleteCoupon,
      inits,
      search,
      bulk_export,
      onFormFieldChange,
      copyCoupon
    } = this.props.relaxProps;
    console.log('====================================');
    console.log(couponList.toJS(), '1223333');
    console.log('====================================');
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
              addonBefore="优惠劵名称"
              placeholder="请输入优惠劵名称"
              value={form.get('couponName')}
              onChange={(e: any) => {
                onFormFieldChange('couponName', e.target.value);
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
            <AuthWrapper functionName="f_check_export_1">
              <div style={{ paddingBottom: '16px' }}>
                <Button type="primary" onClick={() => bulk_export()}>导出</Button>
              </div>
            </AuthWrapper>
          </FormItem>
        </Form>
        <DataGrid
          rowKey={(record) => record.couponId}
          dataSource={couponList.toJS()}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (pageNum, pageSize) => {
              inits({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <DataGrid.Column
            title="用户账号"
            dataIndex="customerAccount"
            key="customerAccount"
          />
          <DataGrid.Column title="优惠劵名称" dataIndex="couponName" key="couponName" />
          <DataGrid.Column
            title="优惠券面值 (元)"
            dataIndex="denomination"
            key="denomination"
          />
          <DataGrid.Column
            title="有效期"
            dataIndex="validity"
            key="validity"
            width="30%"
          // render={(value) => {
          //   if (value) {
          //     return value.substr(0,value.length-4);
          //   } else {
          //     return '-';
          //   }
          // }}
          />
          <DataGrid.Column
            title="领取数量"
            dataIndex="receiveCount"
            key="receiveCount"
          />
          <DataGrid.Column
            title="优惠券状态"
            dataIndex="couponStatusStr"
            key="couponStatusStr"
          />
        </DataGrid>
      </div>
    );
  }
}
