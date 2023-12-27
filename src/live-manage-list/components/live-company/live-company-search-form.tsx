import React from 'react';
import { Button, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import ActivityModal from './company-modal/activity-modal';
import CouponsModal from './company-modal/coupons-modal';
import { IList } from 'typings/globalType';
const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onCompanyChange: Function;
      onActivityModalOk: Function;
      onIsCouponsModal: Function;
      onCuponsModalOk: Function;
      isActivityModal: boolean;
      selectedRowKeys: IList;
      selectedRows: IList;
      isCouponsModal: boolean;
      activityId: any;
      liveRoomId: any;
      couponsType: string;
    };
  };

  static relaxProps = {
    onCompanyChange: noop,
    onActivityModalOk: noop,
    onIsCouponsModal: noop,
    onCuponsModalOk: noop,
    isActivityModal: 'isActivityModal',
    selectedRowKeys: 'selectedRowKeys',
    selectedRows: 'selectedRows',
    isCouponsModal: 'isCouponsModal',
    activityId: 'activityId',
    liveRoomId: 'liveRoomId',
    couponsType: 'couponsType'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      onCompanyChange,
      isActivityModal,
      onActivityModalOk,
      selectedRowKeys,
      selectedRows,
      isCouponsModal,
      onIsCouponsModal,
      activityId,
      liveRoomId,
      couponsType,
      onCuponsModalOk
    } = this.props.relaxProps;

    return (
      <div>
        {/* <AuthWrapper functionName="f_live_list_management_add1"> */}
        <Button
          type="primary"
          onClick={() => {
            onCompanyChange('isActivityModal', true);
          }}
        >
          添加优惠券活动
        </Button>
        {/* </AuthWrapper> */}
        <ActivityModal
          isVisible={isActivityModal}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          onCouponsDis={(activityId) => {
            onIsCouponsModal(activityId, 'dis');
          }}
          onOk={(keys, rows) => onActivityModalOk(keys, rows)}
          onCancel={() => onCompanyChange('isActivityModal', false)}
        />
        <CouponsModal
          isVisible={isCouponsModal}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          title={couponsType == 'dis' ? '查看优惠券' : '发布优惠券'}
          activityId={activityId}
          liveRoomId={liveRoomId}
          couponsType={couponsType}
          onOk={(keys, rows) => onCuponsModalOk(keys, rows)}
          onCancel={() => onCompanyChange('isCouponsModal', false)}
        />
      </div>
    );
  }
}
