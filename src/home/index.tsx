import React from 'react';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import Header from './component/header';
import TodoItems from './component/todo-items';
import StatisticalReport from './component/statistical-report';
import Ranking from './component/ranking';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div style={styles.container}>
        <Header />
        <TodoItems />
        <StatisticalReport />
        <Ranking />
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: '12px'
  }
};
