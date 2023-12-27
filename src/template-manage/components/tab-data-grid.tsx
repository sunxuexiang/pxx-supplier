import React from 'react';
import { Menu, Button } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';

import TemplateList from './template-list';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      platform: string;
      onClickMenu: Function;
      includePageTypeList: string;
      storeId: number;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    platform: 'platform',
    onClickMenu: noop,
    includePageTypeList: 'includePageTypeList',
    storeId: 'storeId'
  };

  render() {
    const {
      platform,
      onClickMenu,
      includePageTypeList,
      storeId
    } = this.props.relaxProps;
    return (
      <div className="template-manage-main">
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
        <div className="template-manage-content">
          {platform == 'weixin' &&
            includePageTypeList == 'index' && (
              <a
                target="_blank"
                href={`${
                  Const.X_XITE_ADMIN_HOST
                  }/uerTpl/edit?id=weixin-wechat&type=blank&storeId=${storeId}&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==`}
              >
                <Button type="primary">新增模板</Button>
              </a>
            )}
          <TemplateList />
        </div>
        {/*<Tabs*/}
        {/*onChange={(key) => onTabChange(key)}*/}
        {/*activeKey={key}*/}
        {/*style={{ width: '100%' }}*/}
        {/*>*/}
        {/*<Tabs.TabPane tab="微信端" key="weixin">*/}
        {/*<div className="template-manage-content">*/}
        {/*{includePageTypeList == 'index' && (*/}
        {/*<a*/}
        {/*target="_blank"*/}
        {/*href={`${Const.X_XITE_ADMIN_HOST}/uerTpl/edit?id=weixin-wechat&type=blank&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==`}*/}
        {/*>*/}
        {/*<Button type="primary">新增模板</Button>*/}
        {/*</a>*/}
        {/*)}*/}
        {/*<TemplateList />*/}
        {/*</div>*/}
        {/*</Tabs.TabPane>*/}
        {/*<Tabs.TabPane tab="pc端" key="pc">*/}
        {/*<div className="template-manage-content">*/}
        {/*<TemplateList />*/}
        {/*</div>*/}
        {/*</Tabs.TabPane>*/}
        {/*</Tabs>*/}
      </div>
    );
  }
}
