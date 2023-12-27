import React from 'react';
import { Col, Form, Radio, Row, Tabs } from 'antd';
import { Relax } from 'plume2';
import { Const } from 'qmkit';
import Moment from 'moment';

import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
import styled from 'styled-components';
import GoodsList from './goods-list';

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const GreyBox = styled.div`
  background: #f7f7f7;
  padding: 15px;

  p {
    color: #333333;
    line-height: 25px;
  }
`;

const styles = {
  storeName: {
    lineHeight: '16px',
    color: 'rgba(153, 153, 153, 1)',
    fontSize: '12px',
    border: '1px solid rgba(255, 255, 255, 0)'
  }
} as any;

@Relax
export default class BasicInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: {};
      storeName: string;
    };
  };

  static relaxProps = {
    detail: 'detail',
    storeName: 'storeName'
  };

  render() {
    const { detail, storeName } = this.props.relaxProps;
    console.log('debug88 detail', detail);

    return (
      <div>
        <GreyBox>
          <p style={styles.storeName}>店铺名称：{storeName || '-'}</p>
        </GreyBox>
        <div style={{ marginTop: 20 }}>
          <Form style={{ marginTop: 20 }}>
            <Row type="flex" justify="start">
              <Col span={20}>
                <FormItem {...formItemLayout} label="直播标题" required={true}>
                  <div>{detail && detail.name ? detail.name : '--'}</div>
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem {...formItemLayout} label="开播时间" required={true}>
                  <div>
                    {detail && detail.startTime && detail.endTime
                      ? Moment(detail.startTime)
                          .format(Const.TIME_FORMAT)
                          .toString() +
                        '~' +
                        Moment(detail.endTime)
                          .format(Const.TIME_FORMAT)
                          .toString()
                      : '--'}
                  </div>
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem {...formItemLayout} label="主播昵称" required={true}>
                  <div>
                    {detail && detail.anchorName ? detail.anchorName : '--'}
                  </div>
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="主播微信号"
                  required={true}
                >
                  <div>
                    {detail && detail.anchorWechat ? detail.anchorWechat : '--'}
                  </div>
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="分享卡片封面"
                  required={true}
                >
                  {detail && detail.shareImg ? (
                    <img
                      style={{ height: '143px', width: '180px' }}
                      src={detail.shareImg}
                    />
                  ) : (
                    <div />
                  )}
                </FormItem>
              </Col>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="直播间背景墙"
                  required={true}
                >
                  {detail && detail.coverImg ? (
                    <img
                      style={{ height: '320px', width: '180px' }}
                      src={detail.coverImg}
                    />
                  ) : (
                    <div />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem {...formItemLayout} label="商品">
                  <GoodsList />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
