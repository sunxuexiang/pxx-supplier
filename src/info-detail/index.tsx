import React from 'react';

import { Icon, Layout, Input, Button, Divider } from 'antd';
import { getTokenRQ, getMsgList } from './webapi';
import { Const } from 'qmkit';
import moment from 'moment';
import './index.less';
const logo = require('./logo.png');

const { Header, Content, Footer } = Layout;
const { Search } = Input;
export default class CompanyRegister extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      currentData: {}
    };
  }

  componentDidMount() {
    this.init();
  }

  getToken = async () => {
    const res = await getTokenRQ();
    let token = res.context.token;
    return token;
  };

  init = async () => {
    const { id } = this.props.match.params;
    let token = await this.getToken();
    const params = {
      body: {
        messageType: '2',
        pageNum: 0,
        pageSize: 30
      },
      token
    };
    const res = await getMsgList(params);
    console.log(res);
    if (res.code == Const.SUCCESS_CODE) {
      let list = res.context.appMessageVOPage.content;
      list.forEach((item) => {
        if (item.appMessageId == id) {
          this.setState({ currentData: item });
        }
      });
    }
  };

  render() {
    const { currentData } = this.state;
    const str =
      '工作职责：  \n1.中英文版本翻译工作;\n\n2. 处理产品需求的调研、收集、分析和整理工作；\n3. 撰写产品文档、绘制原型图，负责部分功能的迭代落地；\n\n4. 产品文档和GTM材料管理和更新，参与需求评审，跟进版本开发；\n5.负责跟进和推进项目的落地与实施，并跟踪项目进度及上线后的反馈情况。';
    return (
      <Layout className="infoDetail-layout">
        <Header className="infoDetail-content">
          <div className="infoDetail-header">
            <span>商家信息服务</span>
            <span>基本信息</span>
            <span>我的订单</span>
            <span>账号安全</span>
            <span>客服电话：4008319899</span>
            <span>工作时间：9:00 - 18:00</span>
          </div>
          <div className="infoDetail-nav">
            <img src={logo} alt="" />
            <Search
              placeholder="搜索"
              className="infoDetail-nav-search"
              addonBefore="商品"
              enterButton
              style={{ width: 486 }}
            />
            <div className="topShopcart">
              <div className="shopcartTop ant-dropdown-trigger">
                <Icon type="shopping-cart" />
                <span className="cart_name">
                  &nbsp;购物车&nbsp;&nbsp;&nbsp;
                </span>
                <span
                  className="cart_num"
                  style={{ backgroundColor: 'rgb(255, 98, 0)' }}
                >
                  0
                </span>
              </div>
            </div>
          </div>
        </Header>
        <div style={{ borderBottom: '2px solid black' }}></div>
        <Content>
          <div className="infoDetail-page-content">
            <div className="infoDetail-time">
              发布时间：
              {moment(currentData.sendTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <p className="infoDetail-page-title">{currentData.title}</p>
            <Divider orientation="left">职位描述</Divider>
            <div>
              {this.showContent(currentData.content)}
              {/* {this.showContent(str)} */}
            </div>
          </div>
        </Content>
        <Footer className="infoDetail-footer">
          <div className="infoDetail-footer-conent">
            <div>
              <Button type="link" href="https://beian.miit.gov.cn">
                © Copyright 2014-2023.湖南喜吖吖商业服务有限公司
              </Button>
              <Button type="link" href="https://beian.miit.gov.cn">
                版权所有湘ICP备2021006804号-2
              </Button>
              <Button type="link" href="http://www.12377.cn">
                违法和不良信息举报中心
              </Button>
              公司邮箱：13973150358@139.com
            </div>
            <div>
              公司地址：长沙市雨花区东二环一段578号高桥大市场西大门综合楼4楼439房
            </div>
          </div>
        </Footer>
      </Layout>
    );
  }

  showContent = (content) => {
    if (content) {
      const arr = content.split('\n');
      return arr.map((item) => <p>{item}</p>);
    }
  };
}

// const styles = {
//   logoBg: {
//     width: 140,
//     height: 44,
//     backgroundColor: 'rgba(255, 255, 255, 0.49)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   container: {
//     height: '100vh',
//     backgroundColor: '#f0f0f0'
//   },
//   logoImg: {
//     display: 'block',
//     width: 120,
//     height: 'auto'
//   },
//   wrapper: {
//     width: 960,
//     margin: '0 auto'
//   },
//   wrapper1: {
//     backgroundColor: '#f5f5f5',
//     height: 'calc(100vh - 64px)',
//     position: 'relative',
//     overflowY: 'auto'
//   } as any,
//   content: {
//     width: 960,
//     margin: '30px auto',
//     padding: 90,
//     backgroundColor: '#fff'
//   }
// };
