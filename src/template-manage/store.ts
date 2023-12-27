import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import 'whatwg-fetch';
import { message } from 'antd';
import TemplateActor from './actor/template-actor';
import {
  getList,
  queryTemplateList,
  delTemplate,
  copyTemplate,
  updateTitle,
  getStore
} from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new TemplateActor()];
  }

  init = async () => {
    const result = await getStore();
    if (result.code == Const.SUCCESS_CODE) {
      const storeId = result.context.storeId;
      const pageType = this.state().get('includePageTypeList');
      const platform = this.state().get('platform')
      const res = await getList(
        pageType == 'index' && platform == 'pc'
          ? {
            excludePageTypeList: [],
            includePageTypeList: [this.state().get('includePageTypeList')],
            name: '',
            online: true,
            pageNo: -1,
            pageSize: 10,
            platform: this.state().get('platform'),
            tagList: [],
            typeList: [this.state().get('typeList')],
            storeId
          }
          : {
            excludePageTypeList: [],
            includePageTypeList: [this.state().get('includePageTypeList')],
            name: '',
            online: true,
            pageNo: -1,
            pageSize: 10,
            platform: this.state().get('platform'),
            tagList: [],
            typeList: [this.state().get('typeList')]
          }
      );
      res.data.list = [];

      const templates = await queryTemplateList({
        groupType: 'all',
        includePageTypeList: this.state().get('includePageTypeList'),
        isShow: true,
        name: '',
        platform: this.state().get('platform'),
        sc: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==',
        storeId
      });
      if (templates.status === 1) {
        templates.data.userTplList.map((info) => {
          res.data.list.push({
            platform: info.platform,
            pageType: info.pageType,
            id: info._id,
            _id: info._id,
            previewImage: info.detailInfo.previewImage,
            name: info.name,
            userTpl: true,
            userTplInfo: info
          });
        });
      }
      if (res.status === 1) {
        res.data.tplInfoList.map((info) => {
          res.data.list.push({
            platform: info.platform,
            pageType: info.pageType,
            id: info.tplInfoCode,
            _id: info._id,
            previewImage: info.detailInfo.previewImage,
            name: info.tplInfoName,
            userTpl: false
          });
        });
      }
      this.transaction(() => {
        this.dispatch('store:storeId', storeId);
        this.dispatch('listActor:init', res);
      });
    } else {
      message.error(result.message);
    }
  };

  onDelTemplate = async (id: string) => {
    const res = await delTemplate({
      ids: `["${id}"]`,
      sc: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA=='
    });
    if (res.status === 1) {
      message.success(res.message);
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onCopyTemplate = async (userTplInfo) => {
    const res = await copyTemplate({
      userTplInfo: `${JSON.stringify(
        userTplInfo
          .delete('_id')
          .delete('updatedAt')
          .delete('createdAt')
          .set('name', userTplInfo.get('name').concat(' [副本]'))
      )}`,
      sc: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA=='
    });
    if (res.status === 1) {
      message.success(res.message);
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onTabChange = (index: string) => {
    this.dispatch('form:platform', index);
    this.init();
  };

  onClickMenu = (key: string) => {
    if (key !== this.state().get('includePageTypeList')) {
      this.dispatch('includePageTypeList:set', key);
      this.init();
    }
  };

  onSetEdit = async (inputEdit) => {
    this.dispatch('edit:set', fromJS(inputEdit));
    if (!inputEdit.isShow) {
      let dataList = this.state().get('dataList');
      const obj = dataList.find((info) => info.get('_id') === inputEdit.id);
      if (obj && obj.get('name') !== inputEdit.title) {
        const res = await updateTitle({
          userTplInfo: JSON.stringify(
            obj
              .get('userTplInfo')
              .set('name', inputEdit.title)
              .toJS()
          ),
          sc: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA=='
        });
        if (res.status === 1) {
          this.dispatch('listActor:updateTitle', inputEdit);
        }
      }
    }
  };
}
