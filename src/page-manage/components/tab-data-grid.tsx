import React from 'react';
import { Relax } from 'plume2';
import { Menu } from 'antd';
import { noop } from 'qmkit';
import PageList from './page-List';
import ButtonGroup from './button-group';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      platform: string;
      onClickMenu: Function;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    platform: 'platform',
    onClickMenu: noop
  };

  componentDidMount() {}

  render() {
    const { onClickMenu } = this.props.relaxProps;
    // const key = platform;
    return (
      <div className="page-manage">
        <div className="ant-layout-sider">
          <i className="sider-border-top" />
          <Menu
            onClick={(e) => onClickMenu(e.key)}
            defaultSelectedKeys={['index']}
            mode="inline"
          >
            <Menu.Item key="index">首页</Menu.Item>
            <Menu.Item key="poster">海报页</Menu.Item>
            <Menu.Item key="article">文章页</Menu.Item>
            {/*{platform === 'weixin' && (
              <Menu.Item key="goodsList,goodsInfo,classify,service">
                基础页
              </Menu.Item>
            )}*/}
          </Menu>
        </div>
        <div className="page-manage-content">
          <ButtonGroup />
          <PageList />
        </div>
        {/*<Tabs*/}
        {/*onChange={(key) => onTabChange(key)}*/}
        {/*activeKey={key}*/}
        {/*style={{ width: '100%' }}*/}
        {/*>*/}
        {/*<Tabs.TabPane tab="微信端" key="weixin">*/}
        {/*<div className="page-manage-content">*/}
        {/*<ButtonGroup />*/}
        {/*<PageList />*/}
        {/*</div>*/}
        {/*</Tabs.TabPane>*/}
        {/*<Tabs.TabPane tab="pc端" key="pc">*/}
        {/*<div className="page-manage-content">*/}
        {/*<ButtonGroup />*/}
        {/*<PageList />*/}
        {/*</div>*/}
        {/*</Tabs.TabPane>*/}
        {/*</Tabs>*/}
      </div>
    );
  }
}
