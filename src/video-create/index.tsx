import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import { Form } from 'antd';
import SettingForm from './components/setting-form';
import SettingAddForm from './components/setting-form-add';
const SettingFormDetail = Form.create()(SettingForm);
const SettingAddFormDetail = Form.create()(SettingAddForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoSetting extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { videoId } = this.props.match.params;
    this.store.init(videoId);
  }

  render() {
    const { videoId } = this.props.match.params;
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container customer">
          {videoId == -1 ? (
            <Headline title="发布小视频" />
          ) : (
            <Headline title="编辑小视频" />
          )}
          {videoId == -1 ? <SettingAddFormDetail /> : <SettingFormDetail />}
        </div>
      </div>
    );
  }
}
