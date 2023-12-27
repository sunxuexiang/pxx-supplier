import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IRoute } from './route-with-subroutes';
import noop from './noop';
import { routes, homeRoutes, auditDidNotPass } from '../../src/router';
import { fromJS } from 'immutable';
import { util, cache } from 'qmkit';

export type Loader = () => Promise<any>;

export interface Props {
  path: string;
  exact?: boolean;
  strict?: boolean;
  load: Loader;
  subRoutes?: Array<IRoute>;
  handlePathMatched?: Function;
}

/**
 * 封装异步路由的解决方案
 * @param props 路由参数
 */
export default function AsyncRoute(props: Props) {
  const { load, handlePathMatched, subRoutes, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        const unAuthRoutes = fromJS(homeRoutes);
        if (unAuthRoutes.some(route => route.get('path') == props.match.path)) {
          // 1.不需要登录权限,直接可以访问的页面
          return <AsyncLoader {...props} load={load} subRoutes={subRoutes} />;
        } else {
          if (util.isLogin()) {
            const loginInfo = JSON.parse(
              sessionStorage.getItem(cache.LOGIN_DATA)
            );
            const auditState = loginInfo.auditState; // 商家登录审核状态 -1:未开店(没有审核状态)  0:未审核  1:已审核  2:审核未通过

            if (auditState == 1) {
              // 2.1.审核通过状态下, 只能访问路由中定义的页面(入驻流程无法查看)
              if (
                fromJS(routes).some(
                  route => route.get('path') == props.match.path
                )
              ) {
                return (
                  <AsyncLoader
                    {...props}
                    load={load}
                    subRoutes={subRoutes}
                    handlePathMatched={handlePathMatched}
                  />
                );
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: '/lackcompetence',
                      state: { from: props.location }
                    }}
                  />
                );
              }
            } else {
              // 2.2.非审核成功状态下, 只能看到入驻流程页面(其他页面无法查看)
              if (
                fromJS(auditDidNotPass).some(
                  route => route.get('path') == props.match.path
                )
              ) {
                return (
                  <AsyncLoader {...props} load={load} subRoutes={subRoutes} />
                );
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: '/lackcompetence',
                      state: { from: props.location }
                    }}
                  />
                );
              }
            }
          } else {
            // 2.3.需要登录的,跳转到登录页面
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            );
          }
        }
      }}
    />
  );
}

/**
 * 异步load模块组件
 */
class AsyncLoader extends React.Component<any, any> {
  props: {
    subRoutes?: Array<IRoute>;
    load: Loader;
    handlePathMatched?: Function;
    match: any;
  };

  state: {
    Component: React.ComponentClass<any>;
  };

  static defaultProps = {
    load: noop,
    handlePathMatched: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  componentDidMount() {
    const { load } = this.props;

    const { handlePathMatched } = this.props;
    handlePathMatched(this.props.match.path);

    load()
      .then(Component =>
        this.setState({
          Component: Component.default || Component
        })
      )
      .catch(() => {});
  }

  render() {
    const { Component } = this.state;

    return Component ? (
      <Component {...this.props} key={Math.random()} />
    ) : (
      <div>loading...</div>
    );
  }
}
