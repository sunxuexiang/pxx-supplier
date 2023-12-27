import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { routeWithSubRoutes, history, noop } from 'qmkit';
import { homeRoutes } from './router';
import 'regenerator-runtime/runtime';
import store from './redux/store';
import './index.less';
import Main from './main';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const B2BBoss = () => (
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <Router history={history}>
        <div className="father">
          <Switch>
            {routeWithSubRoutes(homeRoutes, noop)}
            <Route component={Main} />
          </Switch>
        </div>
      </Router>
    </Provider>
  </LocaleProvider>
);

ReactDOM.render(<B2BBoss />, document.getElementById('root'));
