import React from 'react';
import { Breadcrumb, Card, Form, Row, Col, message } from 'antd';
import { Headline, BreadCrumb, util, Const, history, AuthWrapper } from 'qmkit';
import styled from 'styled-components';
import QQModal from './components/qq-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { getImSwitch, smartToothStatus } from './webapi';
import ImModal from './components/im-modal';
import { chatContext } from '../customer-service/chat-context';
import SmartTooth from './components/smart-tooth';

const QQForm = Form.create()(QQModal as any); //品牌弹框
const ContainerDiv = styled.div`
  .methodItem {
    width: 100%;
    border: 1px solid #f5f5f5;
    text-align: center;
    padding: 20px 0;
    img {
      width: 86px;
      height: 86px;
    }
    h4 {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
  }
  .bar {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px 0;
    .status {
      font-size: 12px;
      color: #666;
    }
    .links {
      font-size: 12px;
      margin-left: 15px;
    }
  }
`;

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OnlineService extends React.Component<any, any> {
  store: AppStore;
  static contextType = chatContext;
  constructor(props) {
    super(props);
    this.state = {
      imConfig: {},
      imModalShow: false,
      smartToothConfig: {},
      showSmartTooth: false
    };
  }

  componentDidMount() {
    if (!util.isThirdStore()) {
      this.store.init();
    }
    this.searchIMSwitch();
    this.getSmartTooth();
  }
  // 查询IM客服配置
  searchIMSwitch = (isRefresh = false, serviceAccountList = []) => {
    getImSwitch().then((data) => {
      // 右侧客服开启关闭
      if (isRefresh) {
        this.context.changeChatStatus(data.res.context, serviceAccountList);
      }
      this.setState({ imConfig: data.res.context });
    });
  };
  // 打开弹窗
  showImConfig = () => {
    this.setState({ imModalShow: true });
  };
  getSmartTooth = () => {
    smartToothStatus().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        message.error('查询智齿状态失败');
        return;
      }
      this.setState({ smartToothConfig: data.res.context });
    });
  };
  render() {
    const enableFlag = this.store.state().get('enableFlag');
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <ContainerDiv>
            <Headline title="在线客服" />
            <div style={{ display: 'flex' }}>
              {!util.isThirdStore() && (
                <Card
                  style={{ width: 300, margin: 20 }}
                  bodyStyle={{ padding: 10 }}
                >
                  <div className="methodItem">
                    <img src={require('./img/qq.png')} />
                    <h4>QQ客服</h4>
                  </div>
                  <div className="bar">
                    <div className="status">
                      {enableFlag ? '已启用' : '未启用'}
                    </div>
                    <div>
                      <a
                        onClick={() => this.store.onEditServer()}
                        className="links"
                      >
                        编辑
                      </a>
                    </div>
                  </div>
                </Card>
              )}

              <Card
                style={{ width: 300, margin: 20 }}
                bodyStyle={{ padding: 10 }}
              >
                <div className="methodItem">
                  <img src={require('./img/im.png')} />
                  <h4>IM商家客服</h4>
                </div>
                <div className="bar">
                  <div className="status">
                    {this.state.imConfig.serverStatus === 0
                      ? '未启用'
                      : '已启用'}
                  </div>
                  <div>
                    <AuthWrapper functionName="f_tx_im_setting">
                      <a
                        onClick={() => {
                          history.push({
                            pathname: '/im-setting-index'
                          });
                        }}
                        className="links"
                      >
                        设置
                      </a>
                    </AuthWrapper>

                    <a
                      onClick={() => {
                        this.showImConfig();
                      }}
                      className="links"
                    >
                      编辑
                    </a>
                  </div>
                </div>
              </Card>

              {!util.isThirdStore() && (
                <Card
                  style={{ width: 300, margin: 20 }}
                  bodyStyle={{ padding: 10 }}
                >
                  <div className="methodItem" style={{ height: 154 }}>
                    <img
                      src={require('./img/zc.jpg')}
                      style={{
                        width: 200,
                        height: 50,
                        marginTop: 20,
                        marginBottom: 10
                      }}
                    />
                    <h4>智齿客服</h4>
                  </div>
                  <div className="bar">
                    <div className="status">
                      {this.state.smartToothConfig.serviceSwitchType === 2
                        ? '已启用'
                        : '未启用'}
                    </div>
                    <div>
                      <a
                        onClick={() => {
                          this.setState({ showSmartTooth: true });
                        }}
                        className="links"
                      >
                        编辑
                      </a>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <QQForm />
          </ContainerDiv>
        </div>
        {/* IM */}
        <ImModal
          show={this.state.imModalShow}
          imData={this.state.imConfig}
          closeModal={(isRefresh, serviceAccountList = []) => {
            if (isRefresh) {
              this.searchIMSwitch(isRefresh, serviceAccountList);
            }
            this.setState({ imModalShow: false });
          }}
        />
        {/* 智齿 */}
        <SmartTooth
          visible={this.state.showSmartTooth}
          defaultStatus={this.state.smartToothConfig.serviceSwitchType}
          hideModal={() => {
            this.setState({ showSmartTooth: false });
            this.getSmartTooth();
          }}
        />
      </div>
    );
  }
}
