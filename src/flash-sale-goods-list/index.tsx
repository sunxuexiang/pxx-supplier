import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { Relax, StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';
import moment from 'moment';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { activityDate, activityTime } = this.props.match.params;
    this.store.init({ activityDate, activityTime });
  }

  render() {
    const activityDate = this.store.state().get('activityDate');
    const activityTime = this.store.state().get('activityTime');
    const startTime = activityDate + ' ' + activityTime;
    const endTime = moment(startTime, 'YYYY-MM-DD HH:mm')
      .add(2, 'hours')
      .format('YYYY-MM-DD HH:mm');
    const titleName = startTime + '场次 ' + ' 结束时间' + endTime;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>整点秒杀</Breadcrumb.Item>
        </BreadCrumb>
        {/* 面包屑导航 */}
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>抢购活动</Breadcrumb.Item>
          <Breadcrumb.Item>整点秒杀</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          {/* 头部标题 */}
          <Headline title={titleName} />

          {/* 搜索项区域 */}
          <SearchDataForm />

          {/* 操作按钮区域 */}
          <ButtonGroup />

          {/* 数据列表区域 */}
          <InfoList />

          {/* 编辑弹框 */}
          <EditModal />
        </div>
      </div>
    );
  }
}
