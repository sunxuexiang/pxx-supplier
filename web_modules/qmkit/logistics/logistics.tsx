import React from 'react';
import { Timeline, Popover } from 'antd';
import * as webapi from './webapi';
import { Const } from 'qmkit';

interface LogisticProps {
  companyInfo?: any;
  deliveryTime?: any;
}

export default class LogisticPopover extends React.Component<
  LogisticProps,
  any
> {
  props: {
    companyInfo: any;
    deliveryTime: any;
    consignee?: any;
  };

  state = {
    logistics: [],
    showMore: false,
    showAll: false
  };

  showLogistics = async (logistics) => {
    const { consignee } = this.props;
    let params = {
      companyCode: logistics.get('logisticStandardCode'),
      deliveryNo: logistics.get('logisticNo')
    } as any;
    if(consignee){
      params.phone = consignee.phone;
      params.to = consignee.detailAddress;
    }
    this.setState({ showAll: false });
    const { res } = await webapi.fetchDeliveryDetail(params);
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context.length > 3) {
        this.setState({ showMore: true });
      } else {
        this.setState({ showMore: false });
      }
      this.setState({ logistics: res.context });
    }
  };

  render() {
    const { companyInfo, deliveryTime } = this.props;
    return (
      <Popover
        placement="bottomLeft"
        content={
          <div className="order-delivery" style={{ maxWidth: 560 }}>
            <div
              className="order-delivery-head clearfix"
              style={{ marginBottom: 15 }}
            >
              <ul className="pull-left">
                <li>
                  物流公司：{companyInfo.get('logisticCompanyName')
                    ? companyInfo.get('logisticCompanyName')
                    : '无'}
                </li>
                <li>
                  物流单号：{companyInfo.get('logisticNo')
                    ? companyInfo.get('logisticNo')
                    : '无'}
                </li>
                <li>发货时间：{deliveryTime ? deliveryTime : '无'}</li>
              </ul>
            </div>
            {this.state.logistics && this.state.logistics.length > 0 ? (
              <Timeline
                pending={
                  this.state.showMore ? (
                    <p>
                      以上为最新跟踪信息<a
                        href="javascript:void(0)"
                        onClick={() => this._showAll()}
                      >
                        查看全部
                      </a>
                    </p>
                  ) : (
                    false
                  )
                }
              >
                {this.state.showAll
                  ? this.state.logistics &&
                    this.state.logistics.map((v, k) => {
                      return (
                        <Timeline.Item key={k}>
                          <p>{v.context}{v.time || ''}</p>
                        </Timeline.Item>
                      );
                    })
                  : this.state.logistics &&
                    this.state.logistics
                      .filter((_value, k) => k < 3)
                      .map((v, k) => {
                        return (
                          <Timeline.Item key={k}>
                            <p>{v.context}{v.time || ''}</p>
                          </Timeline.Item>
                        );
                      })}
              </Timeline>
            ) : (
              <div style={{ textAlign: 'center' }}>暂无物流信息</div>
            )}
          </div>
        }
        trigger="click"
      >
        <a href="javascript:;" onClick={() => this.showLogistics(companyInfo)}>
          &nbsp;实时物流&nbsp;
        </a>
      </Popover>
    );
  }

  /**
   * 查看全部
   * @private
   */
  _showAll = () => {
    this.setState({ showAll: true, showMore: false });
  };
}
