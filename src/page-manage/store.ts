import { Store, IOptions } from 'plume2';
import 'whatwg-fetch';
import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import { message } from 'antd';
import PageActor from './actor/page-actor';

import {
  getTplList,
  copyPage,
  delPage,
  queryTemplateList,
  setIndex,
  updateTitle,
  getStore
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new PageActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    let includePageTypeList;
    this.state()
      .get('includePageTypeList')
      .forEach((x, i) => {
        includePageTypeList = encodeURI(`"${x}"`);
        if (this.state().get('includePageTypeList').length - 1 > i) {
          includePageTypeList += ',';
        }
      });
    const result = await getStore();
    if (result.code == Const.SUCCESS_CODE) {
      const storeId = result.context.storeId;
      const res = await fetch(
        `${
        Const.X_XITE_OPEN_HOST
        }/api/page/list?includePageTypeList=[${includePageTypeList}]&excludePageTypeList=[]&platform=${this.state().get(
          'platform'
        )}&pageNo=${pageNum}&pageSize=${pageSize}&storeId=${storeId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: (window as any).token
          }
        }
      ).then((res: any) => {
        return res.json();
      });
      if (res.status == 1) {
        this.transaction(() => {
          this.dispatch('store:storeId', storeId);
          this.dispatch('loading:end');
          this.dispatch('listActor:init', res);
          this.dispatch('list:currentPage', pageNum + 1);
        });
      } else {
        this.dispatch('loading:end');
        message.error(res.message);
      }
    } else {
      this.dispatch('loading:end');
      message.error(result.message);
    }
  };

  copy = async (id: string) => {
    const res = await copyPage({ id });
    if (res.status == 1) {
      message.success(res.message);
      this.init();
    } else {
      message.error(res.message);
    }
  };

  deletePage = async (rowInfo) => {
    const storeId = this.state().get('storeId');
    const res = await delPage({
      pageCode: rowInfo.pageCode,
      pageType: rowInfo.pageType,
      platform: rowInfo.platform,
      storeId: storeId
    });
    if (res.status == 1) {
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

  onActivate = async (pageCode) => {
    const storeId = this.state().get('storeId');
    const res = await setIndex({
      platform: this.state().get('platform'),
      pageCode: pageCode,
      storeId: storeId
    });
    if (res.status === 1) {
      message.success(res.message);
      this.init();
    } else {
      message.error(res.message);
    }
  };

  setVisible = async (visible: boolean) => {
    let list = [];
    if (visible) {
      const storeId = this.state().get('storeId');
      const pageType = this.state().get('includePageTypeList');
      const platform = this.state().get('platform')
      const res = await getTplList(
        pageType.first() == 'index' && platform == 'pc'
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
      const templates = await queryTemplateList({
        includePageTypeList: this.state().get('includePageTypeList'),
        pageSize: -1,
        platform: this.state().get('platform'),
        sc: 'H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==',
        storeId
      });
      if (templates.totalCount > 0) {
        templates.userTplList.map((info) => {
          list.push({
            tplInfoName: info.name,
            templateCode: info._id,
            previewImage: info.detailInfo.previewImage,
            userTpl: true
          });
        });
      }
      if (res.status === 1) {
        res.data.tplInfoList.map((info) => {
          list.push({
            templateCode: info.tplInfoCode,
            previewImage: info.detailInfo.previewImage,
            tplInfoName: info.tplInfoName,
            userTpl: false
          });
        });
      }
    }

    this.transaction(() => {
      this.dispatch('templateList:set', list);
      this.dispatch('visible:set', visible);
    });
  };

  onClickMenu = (key: string) => {
    let includePageTypeList = [key];
    const keys = key.split(',');
    if (keys.length > 1) {
      includePageTypeList = [];
      keys.forEach(function (e) {
        includePageTypeList.push(e);
      });
    }
    if (includePageTypeList !== this.state().get('includePageTypeList')) {
      this.dispatch('includePageTypeList:set', fromJS(includePageTypeList));
      this.init();
    }
  };

  onSetEdit = async (inputEdit) => {
    console.log('edit-----------------------------------------start');
    this.dispatch('edit:set', inputEdit);
    if (!inputEdit.isShow) {
      let dataList = this.state().get('dataList');
      const obj = dataList.find((info) => info.get('_id') === inputEdit.id);
      if (obj && obj.get('title') !== inputEdit.title) {
        const storeId = this.state().get('storeId');
        const res = await updateTitle({
          pageCode: obj.get('pageCode'),
          pageType: obj.get('pageType'),
          platform: obj.get('platform'),
          title: inputEdit.title,
          storeId: storeId
        });
        if (res.status === 1) {
          let list = dataList.map((info) => {
            if (info.get('_id') === inputEdit.id) {
              return info.set('title', inputEdit.title);
            }
            return info;
          });
          const data = {
            data: { pageInfoList: list, totalCount: this.state().get('total') }
          };
          this.dispatch('listActor:init', data);
        }
      }
    }

    console.log(
      'edit-----------------------------------------------------------------end'
    );
  };
}
