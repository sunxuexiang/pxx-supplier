import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const, util, history } from 'qmkit';
import { fromJS } from 'immutable';
import VideoSettingActor from './actor/view-create';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new VideoSettingActor()];
  }

  init = async (videoId) => {
    this.dispatch('setting:editSetting', fromJS({ videoId: videoId }));
    if (videoId == '-1') {
      // this.dispatch('setting:editSetting', fromJS({ 'newadd': true }));
    } else {
      const response = await webapi.getVideo(videoId);
      if (!response) return;
      const { res } = response;
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch(
          'setting:editSetting',
          fromJS({ videoName: res.context.videoManagementVO.videoName })
        );
        this.dispatch(
          'setting:editSetting',
          fromJS({ artworkUrl: [res.context.videoManagementVO.artworkUrl] })
        );
        this.dispatch(
          'setting:editSetting',
          fromJS({ resourceKey: res.context.videoManagementVO.resourceKey })
        );
        this.dispatch(
          'setting:editGoods',
          fromJS({ goodsId: res.context.videoManagementVO.goodsId })
        );
        this.dispatch(
          'setting:editGoods',
          fromJS({ goodsInfoId: res.context.videoManagementVO.goodsInfoId })
        );
        this.dispatch(
          'setting:editGoods',
          fromJS({ goodsInfoName: res.context.videoManagementVO.goodsInfoName })
        );
      }
    }
  };

  addVideo = async (artworkUrl) => {
    const settings = this.state()
      .get('settings')
      .toJS();
    const goods = this.state()
      .get('goods')
      .toJS();
    if (settings.videoName == '') {
      message.error('请输入小视频名称!');
      return;
    }
    if (settings.videoName.trim() == '') {
      message.error('小视频名称不能为空!');
      return;
    }
    if (!artworkUrl) {
      message.error('请上传小视频!');
      return;
    }
    let response = null;
    let param = {
      artworkUrl,
      resourceKey: artworkUrl,
      videoName: settings.videoName,
      goodsInfoId: goods.goodsInfoId,
      goodsId: goods.goodsId
    };
    if (settings.videoId == -1) {
      response = await webapi.addVideo({ ...param });
    } else {
      response = await webapi.modifyVideo({
        ...param,
        videoId: settings.videoId
      });
    }
    if (!response) return;
    const { res } = response;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功!');
      history.push('/video-setting');
    } else {
      message.error('保存失败!');
    }
  };

  /**
   * 基本配置form属性变更
   */
  settingFormChange = (key, value) => {
    this.dispatch('setting:editSetting', fromJS({ [key]: value }));
  };
  goodsChange = (key, value) => {
    this.dispatch('setting:editGoods', fromJS({ [key]: value }));
  };
  modalVisible = (visible) => {
    this.dispatch('setting:visible', visible);
  };
  paramFormChange = (value) => {
    const artworkUrl = this.state()
      .getIn(['settings', 'artworkUrl'])
      .toJS();
    const index = artworkUrl[0].indexOf('.com');
    const videoUrl = artworkUrl[0].substring(0, index + 4);
    this.dispatch('setting:paramFormChange', fromJS([`${videoUrl}/${value}`]));
  };
}
