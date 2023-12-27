import React, { Component } from 'react';
import { Relax } from 'plume2';

import { Icon } from 'antd';

import { couponDescQL } from '../ql';

const COUPON_TYPE = {
  0: '通用券',
  1: '店铺券',
  2: '运费券'
};

const StatusImg =
  'data:image/png;base64,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';

@Relax
export default class MobileShowBox extends Component<any, any> {
  props: {
    relaxProps?: {
      couponType: string;
      couponName: string;
      rangeDayType: Number;
      startTime: string;
      endTime: string;
      effectiveDays: Number;
      denomination: Number;
      fullBuyType: Number;
      fullBuyPrice: Number;
      scopeType: Number;
      couponDesc: string;
      prompt: string;
    };
  };

  static relaxProps = {
    couponType: 'couponType',
    couponName: 'couponName',
    rangeDayType: 'rangeDayType',
    startTime: 'startTime',
    endTime: 'endTime',
    effectiveDays: 'effectiveDays',
    denomination: 'denomination',
    fullBuyType: 'fullBuyType',
    fullBuyPrice: 'fullBuyPrice',
    scopeType: 'scopeType',
    prompt: 'prompt',
    couponDesc: couponDescQL
  };

  render() {
    const {
      couponType,
      couponName,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      scopeType,
      couponDesc,
      prompt
    } = this.props.relaxProps;

    return (
      <div style={{ marginRight: 10 }}>
        <div style={styles.mobileBox}>
          <div style={{ textAlign: 'center' }}>
            <img src={StatusImg} alt="" width="292" />
          </div>
          <div style={styles.headBox}>
            <Icon style={{ width: 0 }} type="left" />
            <p style={{ flex: 1 }}>我的优惠券</p>
          </div>
          <div style={styles.content}>
            <div style={styles.couponBox}>
              <div style={{ flex: 1, textAlign: 'center', maxWidth: 98 }}>
                <p>
                  ￥<span style={{ fontSize: 24 }}>{denomination || 0}</span>
                </p>
                <p>{this.fullBuyTypeBox(fullBuyType, fullBuyPrice)}</p>
              </div>
              <div style={{ flex: 2, maxWidth: 184 }}>
                <div style={{ lineHeight: '14px' }}>
                  <span style={styles.couponType}>
                    {COUPON_TYPE[couponType]}
                  </span>
                  &nbsp;
                  <span style={styles.couponName}>
                    {couponName || '优惠券名称'}
                  </span>
                </div>
                <div style={styles.scopeType}>
                  {/*限商品: {this.scopeTypeBox(scopeType)}*/}
                  {prompt || '优惠券提示文案'}
                </div>
                <div style={{ color: '#999' }}>
                  {this.rangeDayTypeBox(
                    rangeDayType,
                    startTime,
                    endTime,
                    effectiveDays
                  )}
                </div>
              </div>
            </div>
            <div style={styles.infoBox}>
              使用说明:
              <div
                dangerouslySetInnerHTML={{
                  __html: couponDesc || ''
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  rangeDayTypeBox = (rangeDayType, startTime, endTime, effectiveDays) => {
    if (rangeDayType === 0 && startTime && endTime) {
      return `${startTime} ~ ${endTime}`;
    } else if (rangeDayType === 1 && effectiveDays) {
      return `${effectiveDays}天内有效`;
    }
  };

  fullBuyTypeBox = (fullBuyType, fullBuyPrice) => {
    if (fullBuyType === 1) {
      if (fullBuyPrice > 0) {
        return `满${fullBuyPrice}可用`;
      } else {
        return '满--可用';
      }
    } else if (fullBuyType === 0) {
      return '满0元可用';
    }
  };

  scopeTypeBox = (scopeType) => {
    if (scopeType == 0) {
      return '全部商品可用';
    } else if (scopeType == 1) {
      return '按品牌';
    } else if (scopeType == 3) {
      return '按店铺分类';
    } else if (scopeType == 4) {
      return '自定义选择';
    }
  };
}

const styles = {
  mobileBox: {
    border: '1px solid #eee',
    width: 320
  },
  headBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '5px 10px'
  },
  content: {
    backgroundColor: '#fafafa',
    padding: 10,
    fontSize: 12
  },
  couponBox: {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'row'
  },
  couponType: {
    display: 'inline-block',
    padding: '2px 3px',
    color: '#333',
    border: '1px solid #333'
  },
  couponName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 152,
    verticalAlign: '-3px',
    height: 14,
    display: 'inline-block',
    textOverflow: 'ellipsis'
  },
  scopeType: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 198,
    height: 15,
    display: 'inline-block',
    textOverflow: 'ellipsis'
  },
  infoBox: {
    marginTop: 5,
    backgroundColor: '#fff',
    padding: 5,
    wordBreak: 'break-all'
  }
} as any;
