import React from 'react';
// import { Relax } from 'plume2';
import { noop, Const, DataGrid, QMMethod } from 'qmkit';
import { Modal, Form, Input, Tooltip, Table, Button } from 'antd';
import moment from 'moment';

import * as webapis from './webapi';
const { Column } = Table;

const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

// @Relax
export default class CouponsModal extends React.Component<any, any> {
  // _rejectForm;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isModalVisible: props.isVisible,
      searchParams: {},
      companyList: [],
      selectedRowKeys: props.selectedRowKeys
        ? props.selectedRowKeys.toJS()
        : [],
      selectedRows: props.selectedRows ? props.selectedRows.toJS() : [],
      couponsType: props.couponsType ? props.couponsType : 'dis',
      activityId: props.activityId || null,
      liveRoomId: props.liveRoomId || null
    };
  }

  componentDidMount() {
    // this.init();
  }

  componentWillReceiveProps(nextProps) {
    console.log(6666);
    this.setState(
      {
        isModalVisible: nextProps.isVisible,
        couponsType: nextProps?.couponsType || 'dis',
        activityId: nextProps.activityId,
        liveRoomId: nextProps.liveRoomId,
        selectedRowKeys: nextProps?.selectedRowKeys?.toJS() || [],
        selectedRows: nextProps?.selectedRows?.toJS() || []
      },
      () => {
        if (this.state.isModalVisible) {
          this.init();
        }
      }
    );
  }

  render() {
    const {
      isModalVisible,
      loading,
      companyList,
      selectedRowKeys,
      couponsType
    } = this.state;
    return (
      <Modal
        title={this.props?.title || '查看优惠券'}
        visible={isModalVisible}
        width={1100}
        footer={[
          <Button key="back" onClick={() => this.handleCancel()}>
            取消
          </Button>
        ]}
        // onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <DataGrid
          loading={loading}
          rowKey="couponId"
          dataSource={companyList}
          columns={[...this._columns, couponsType != 'dis' ? this.option : {}]}
        ></DataGrid>
      </Modal>
    );
  }

  _columns = [
    {
      key: 'couponName',
      dataIndex: 'couponName',
      title: '优惠券名称',
      align: 'left'
    },
    {
      key: 'denominationStr',
      dataIndex: 'denominationStr',
      title: '面值',
      align: 'left'
    },
    {
      key: 'validity',
      dataIndex: 'validity',
      title: '有效期',
      align: 'left'
    },
    {
      key: 'cateNamesStr',
      dataIndex: 'cateNamesStr',
      title: '优惠券分类',
      align: 'left',
      render: (value) => {
        return value.length > 12 ? `${value.substring(0, 12)}...` : value;
      }
    },
    {
      key: 'scopeNamesStr',
      dataIndex: 'scopeNamesStr',
      title: '使用范围',
      align: 'left',
      render: (value) => {
        return value.length > 12 ? `${value.substring(0, 12)}...` : value;
      }
    },
    {
      key: 'couponStatusStr',
      dataIndex: 'couponStatusStr',
      title: '优惠券状态',
      align: 'left'
    }
  ];
  option = {
    key: 'option',
    dataIndex: 'option',
    title: '操作',
    render: (text, rowInfo: any) => {
      console.log(this.state.couponsType);
      return (
        <a onClick={() => this.handleOk(rowInfo.couponId, rowInfo.sendStatus)}>
          {rowInfo.sendStatus ? '取消发放' : '发放'}
        </a>
      );
    }
  };

  handleOk = (couponId, sendStatus) => {
    const { onOk } = this.props;
    // this.state.selectedRowKeys,this.state.selectedRows
    onOk([couponId], sendStatus);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  init = async () => {
    let { activityId, liveRoomId } = this.state;
    let { res } = await webapis.fetchCouponActivity({
      activityId,
      liveId: liveRoomId,
      pageSize: 10000,
      pageNum: 0
    });
    if ((res as any).code == Const.SUCCESS_CODE) {
      // 3.格式化返回结构

      let couponInfos = res.context.couponInfoList;
      couponInfos.forEach((coupon) => {
        // 3.1.面值
        coupon.denominationStr =
          coupon.fullBuyType == 0
            ? `满0减${coupon.denomination}`
            : `满${coupon.fullBuyPrice}减${coupon.denomination}`;
        // 3.2.有效期
        if (coupon.rangeDayType == 0) {
          // 按起止时间
          let startTime = moment(coupon.startTime)
            .format(Const.DAY_FORMAT)
            .toString();
          let endTime = moment(coupon.endTime)
            .format(Const.DAY_FORMAT)
            .toString();
          coupon.startTime = coupon.validity = `${startTime} 至 ${endTime}`;
        } else {
          // 按N天有效
          coupon.validity = `领取当天${coupon.effectiveDays}日内有效`;
        }
        // 3.3.优惠券分类
        coupon.cateNamesStr =
          coupon.cateNames.length != 0
            ? coupon.cateNames.reduce((a, b) => `${a},${b}`, '').substr(1)
            : '其他';
        // 3.4.使用范围
        if ([0, 4].indexOf(coupon.scopeType) != -1) {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        } else {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            ':' +
            (coupon.scopeNames.length != 0
              ? coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1)
              : '-');
        }
        // 3.5.优惠券状态
        coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
        //3.6 使用范围
        if (coupon.scopeType == 0) {
          coupon.scopeNamesStr = '全部商品';
        } else if (coupon.scopeType == 4) {
          coupon.scopeNamesStr = '部分商品';
        }
      });
      this.setState({
        companyList: couponInfos,
        loading: false
      });
    }
  };
}
