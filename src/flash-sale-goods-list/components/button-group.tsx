import React from 'react';
import { Button } from 'antd';
import { Relax } from 'plume2';
import {AuthWrapper, history} from 'qmkit';
import moment from 'moment';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      activityDate: string;
      activityTime: string;
    };
  };

  static relaxProps = {
    activityDate: 'activityDate',
    activityTime: 'activityTime'
  };

  render() {
    const { activityDate, activityTime } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_flash_sale_goods_add'}>
        {/*在活动开始前一小时后无法编辑*/}
        {moment().isBefore(
          moment(
            activityDate + ' ' + activityTime,
            'YYYY-MM-DD HH:mm'
          ).subtract(1, 'hours')
        ) && (
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: `/add-flash-sale/${activityDate}/${activityTime}`
              });
            }}
          >
            新增
          </Button>
        )}
        </AuthWrapper>
      </div>
    );
  }
}
