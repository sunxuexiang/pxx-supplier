import React, { useRef, MutableRefObject, memo } from 'react';
import { Layout } from 'antd';
import {
  routeWithSubRoutes,
  MyHeader,
  MyLeftLevel1,
  MyLeftMenu,
  Const
} from 'qmkit';
const { Content } = Layout;
import { routes, auditDidNotPass } from './router';
import moment from 'moment';

const SystemLayout = (props) => {
  const leftMenuRef: MutableRefObject<any> = useRef(null) as any;
  const styles = {
    wrapper: {
      backgroundColor: '#f5f5f5',
      height: 'calc(100vh - 64px)',
      position: 'relative',
      overflowY: 'auto'
    },
    copyright: {
      height: 48,
      lineHeight: '60px',
      textAlign: 'center',
      color: '#999'
    }
  } as any;
  /**
   * 头部的一级菜单刷新后,初始化左侧菜单的展开菜单状态
   * @private
   */
  const _onFirstActiveChange = () => {
    leftMenuRef.current._openKeysChange(['0']);
  };
  return (
    <Layout>
      {/*头部*/}
      <MyHeader />
      <Layout className="ant-layout-has-sider">
        {/*左侧一级菜单*/}
        <MyLeftLevel1
          matchedPath={props.matchedPath}
          onFirstActiveChange={() => {
            _onFirstActiveChange();
          }}
        />
        {/*左侧二三级菜单*/}
        <MyLeftMenu matchedPath={props.matchedPath} ref={leftMenuRef} />
        {/*右侧主操作区域*/}
        {/* <chatContext.Provider
          value={{ changeChatStatus: this.changeChatStatus }}
        > */}
        <Content>
          <div style={styles.wrapper} id="page-content">
            {routeWithSubRoutes(routes, props.handlePathMatched)}
            {routeWithSubRoutes(auditDidNotPass, props.handlePathMatched)}
            <div style={styles.copyright}>
              © 2017-{moment().format('YYYY')} 大白鲸 版本号：
              {Const.COPY_VERSION}
            </div>
          </div>
        </Content>
        {/* </chatContext.Provider> */}
      </Layout>
    </Layout>
  );
};

export default memo(SystemLayout);
