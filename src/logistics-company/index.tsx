import React from 'react';
import { Breadcrumb, Form, Tabs } from 'antd';
import { Relax, StoreProvider } from 'plume2';
import { Headline, AuthWrapper, cache } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';
import RuleForm from './components/rule-form';
import SyncModal from './components/sync-modal';

const SearchDataForm = Relax(Form.create()(SearchForm));
const { TabPane } = Tabs;

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // const currentPath = this.props.match.path;
    // const urlType = currentPath === '/logistics-company' ? 0 : 1;
    const urlType = this.props.urlType;
    this.store.setUrlTypeChange(urlType);
    this.store.init();
    // this.store.ruleInit(); // 配送方式菜单合并后 不能再设置规则设置和同步规则 故此处可注释
    // const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    // if (loginInfo && loginInfo.storeId === 123457929) {
    //   // 只有 喜吖吖自营 这一个商家有同步按钮
    //   this.store.getSelfManage();
    // }
    sessionStorage.setItem('urlType', urlType);
  }

  render() {
    let { urlType } = this.props;
    return (
      // <div>
      //   {/* 面包屑导航 */}
      //   <Breadcrumb separator=">">
      //     <Breadcrumb.Item>
      //       {urlType == 0 ? '托运部' : '指定专线'}
      //     </Breadcrumb.Item>
      //   </Breadcrumb>

      //   <div className="container">
      //     <AuthWrapper functionName={'f_logistics_company'}>
      //       {/* 头部标题 */}
      //       <Headline title={urlType == 0 ? '托运部' : '指定专线'} />
      //       <Tabs defaultActiveKey="1">
      //         <TabPane tab="规则设置" key="1">
      //           <RuleForm />
      //         </TabPane>
      //         <TabPane tab="物流公司列表" key="2">
      //           {/* 搜索项区域 */}
      //           <SearchDataForm />

      //           {/* 操作按钮区域 */}
      //           <ButtonGroup />

      //           {/* 数据列表区域 */}
      //           <InfoList />

      //           {/* 编辑弹框 */}
      //           <EditModal />
      //         </TabPane>
      //       </Tabs>
      //       {/* 同步设置弹框 */}
      //       <SyncModal />
      //     </AuthWrapper>
      //   </div>
      // </div>
      <div>
        {/* 搜索项区域 */}
        <SearchDataForm urlType={urlType} />
        {/* 操作按钮区域 */}
        {urlType == 1 && <ButtonGroup />}
        <InfoList />
        {urlType == 1 && <EditModal />}
      </div>
    );
  }
}
