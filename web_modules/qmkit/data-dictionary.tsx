import React from 'react';
import { Modal, Icon } from 'antd';

export default class DataModal extends React.Component<any, any> {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <a
          href="javascript:;"
          onClick={this.showModal}
          className="configHome"
          style={{ top: 200 }}
        >
          <Icon
            type="question-circle-o"
            style={{ fontSize: 16, color: '#F56C1D' }}
          />
          <p className="configName" style={{ marginTop: 5 }}>
            数据字典
          </p>
        </a>
        <Modal  maskClosable={false}
          wrapClassName="data-modal"
          style={{ position: 'fixed', right: 0, top: 64 }}
          visible={this.state.visible}
          closable={false}
          onCancel={this.hideModal}
          width={230}
          footer={null}
        >
          <div className="data-content">
            <h4>流量统计</h4>
            <dl>
              <dt>访客数UV:</dt>
              <dd>统计时间内，店铺被访问的去重人数</dd>
              <dt>浏览量PV:</dt>
              <dd>统计时间内，店铺所有页面被访问的次数</dd>
              <dt>商品访客数:</dt>
              <dd>统计时间内，商品详情页被访问的去重人数</dd>
              <dt>商品浏览量:</dt>
              <dd>统计时间内，商品详情页被访问的次数</dd>
            </dl>
            <h4>交易统计</h4>
            <dl>
              <dt>下单笔数：</dt>
              <dd>统计时间内，客户成功提交订单的笔数</dd>
              <dt>下单人数：</dt>
              <dd>统计时间内，成功提交订单的去重人数</dd>
              <dt>下单金额：</dt>
              <dd>统计时间内，客户成功提交订单的总金额</dd>
              <dt>退单笔数:</dt>
              <dd>统计时间内，已完成退单的笔数</dd>
              <dt>退单人数：</dt>
              <dd>统计时间内，已完成退单的申请人数</dd>
              <dt>退单金额：</dt>
              <dd>统计时间内，已完成退单的金额</dd>
              <dt>付款订单数 ：</dt>
              <dd>
                统计时间内，客户成功付款的订单数（线上线下付款都以已付款状态为准）
              </dd>
              <dt>付款人数：</dt>
              <dd>
                统计时间内，成功付款的去重人数（线上线下付款都以已付款状态为准）
              </dd>
              <dt>付款金额：</dt>
              <dd>
                统计时间内，客户成功付款的金额（线上线下付款都以已付款状态为准）
              </dd>
              <dt>下单转化率：</dt>
              <dd>统计时间内，下单人数/访客数UV</dd>
              <dt>付款转化率：</dt>
              <dd>统计时间内，付款人数/下单人数</dd>
              <dt>全店转化率：</dt>
              <dd>统计时间内，付款人数/访客数UV</dd>
              <dt>客单价：</dt>
              <dd>统计时间内，下单金额/下单人数</dd>
              <dt>笔单价：</dt>
              <dd>统计时间内，下单金额/下单笔数</dd>
            </dl>
            <h4>商品统计</h4>
            <dl>
              <dt>商品总数（SKU）：</dt>
              <dd>当前SKU种类数</dd>
              <dt>已审核商品（SKU）：</dt>
              <dd>当前已通过平台审核的SKU种类数</dd>
              <dt>上架商品数（SKU）：</dt>
              <dd>当前上架状态的SKU种类数</dd>
              <dt>销售中商品（SKU）：</dt>
              <dd>
                已审核并且为上架状态的SKU种类数（不包含关店/过期店铺商品）
              </dd>
              <dt>商品详情页转化率：</dt>
              <dd>统计时间内，访问过商品的下单人数/商品访客数</dd>
              <dt>下单笔数：</dt>
              <dd>统计时间内，该商品被成功提交订单的笔数</dd>
              <dt>下单金额：</dt>
              <dd>统计时间内，该商品被成功提交订单的金额</dd>
              <dt>下单件数：</dt>
              <dd>统计时间内，该商品被成功提交订单的件数</dd>
              <dt>付款商品件数：</dt>
              <dd>统计时间内，该商品成功付款的件数</dd>
              <dt>退货笔数：</dt>
              <dd>统计时间内，已完成退单中包含该商品的笔数</dd>
              <dt>退货金额：</dt>
              <dd>统计时间内，已完成退单中包含该商品的金额</dd>
              <dt>退货件数：</dt>
              <dd>统计时间内，已完成退单中包含该商品的件数</dd>
              <dt>单品转化率：</dt>
              <dd>统计时间内，该商品下单人数/该商品访客数</dd>
            </dl>
            <h4>客户统计</h4>
            <p>客户概况</p>
            <dl>
              <dt>客户总数：</dt>
              <dd>当前客户总量，仅计算已审核状态下的客户</dd>
              <dt>新增客户数：</dt>
              <dd>统计时间内，新增的客户数，仅计算已审核状态下的客户</dd>
              <dt>注册客户数：</dt>
              <dd>统计时间内，新注册的客户</dd>
            </dl>
            <p>客户订货报表</p>
            <dl>
              <dt>下单笔数：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户成功提交的订单笔数
              </dd>
              <dt>下单件数：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户成功提交的订单的商品总件数
              </dd>
              <dt>下单金额：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户成功提交订单的金额
              </dd>
              <dt>付款订单数：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户成功付款的订单数（线上线下付款都以已付款状态为准）
              </dd>
              <dt>付款金额：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户成功付款的金额（线上线下付款都以已付款状态为准）
              </dd>
              <dt>退单笔数：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户已完成退单的笔数
              </dd>
              <dt>退货件数：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户已完成退单的商品总件数
              </dd>
              <dt>退单金额：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户已完成退单的金额
              </dd>
              <dt>客单价：</dt>
              <dd>统计时间内，该等级客户、该地区客户下单金额/下单人数</dd>
              <dt>笔单价：</dt>
              <dd>
                统计时间内，该客户、该等级客户、该地区客户下单金额/下单笔数
              </dd>
            </dl>
            <h4>业务员统计</h4>
            <dl>
              <dt>下单笔数：</dt>
              <dd>统计时间内，该业务员绑定的客户成功提交订单的笔数</dd>
              <dt>下单人数：</dt>
              <dd>统计时间内，该业务员绑定的客户成功提交订单的去重人数</dd>
              <dt>下单金额：</dt>
              <dd>统计时间内，该业务员绑定的客户成功提交订单的总金额</dd>
              <dt>退单笔数：</dt>
              <dd>统计时间内，该业务员绑定的客户已完成退单的笔数</dd>
              <dt>退单人数：</dt>
              <dd>统计时间内，该业务员绑定的客户已完成退单的去重人数</dd>
              <dt>退单金额：</dt>
              <dd>统计时间内，该业务员绑定的客户已完成退单的金额</dd>
              <dt>付款订单数：</dt>
              <dd>
                统计时间内，该业务员绑定的客户成功付款的订单数（线上线下付款都以已付款状态为准）
              </dd>
              <dt>付款人数：</dt>
              <dd>
                统计时间内，该业务员绑定的客户成功付款的去重人数（线上线下付款都以已付款状态为准）
              </dd>
              <dt>付款金额：</dt>
              <dd>
                统计时间内，该业务员绑定的客户成功付款的金额（线上线下付款都以已付款状态为准）
              </dd>
              <dt>客单价：</dt>
              <dd>统计时间内，该业务员绑定的客户的下单金额/下单人数</dd>
              <dt>笔单价：</dt>
              <dd>统计时间内，该业务员绑定的客户的下单金额/下单笔数</dd>
              <dt>客户总数:</dt>
              <dd>当前该业务员绑定的客户总数</dd>
              <dt>新增客户数：</dt>
              <dd>统计时间内，该业务员新绑定的客户数</dd>
            </dl>
          </div>
          <a
            className="close-data"
            onClick={this.hideModal}
            href="javascript:;"
          >
            <Icon type="double-right" />
            收起
          </a>
        </Modal>
      </div>
    );
  }
}
