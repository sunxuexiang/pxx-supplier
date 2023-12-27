import React from 'react';
import { Form } from 'antd';
import { Relax, StoreProvider } from 'plume2';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // 初始化
    // FindArea.initArea();
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_ware_house_list'}>
        <div>
          {/* 面包屑导航 */}
          <BreadCrumb />

          <div className="container">
            {/* 头部标题 */}
            <Headline title="仓库管理" />

            {/* 页面提示 */}
            {/*<TopTips/>*/}

            {/* 搜索项区域 */}
            <SearchDataForm />

            {/* 操作按钮区域 */}
            {/*{<ButtonGroup />}*/}
            <EditModal />
            {/* 数据列表区域 */}
            <InfoList />

            {/* 编辑弹框 */}
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
