import * as React from 'react';
import { Modal } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;

@Relax
export default class PageModal extends React.Component {
  props: {
    relaxProps?: {
      visible: boolean;
      setVisible: Function;
      templateList: IList;
      platform: string;
      includePageTypeList: IList;
      storeId: number;
    };
  };

  static relaxProps = {
    visible: 'visible',
    setVisible: noop,
    templateList: 'templateList',
    platform: 'platform',
    includePageTypeList: 'includePageTypeList',
    storeId: 'storeId'
  };

  render() {
    const {
      visible,
      setVisible,
      templateList,
      platform,
      includePageTypeList,
      storeId
    } = this.props.relaxProps;
    const addUrl =
      Const.X_XITE_ADMIN_HOST +
      '/editor/editor?action=createBlank&platform=weixin&pageCode=' +
      new Date().getTime() +
      `&storeId=${storeId}&scene=onlineMall&pageType=index&userTpl=true&id=weixin-wechat&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA%3D%3D`;
    return (
      <div>
        <Modal  maskClosable={false}
          title="选择模板"
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width={820}
        >
          <div className="page-modal-wx-title">
            <ul>
              {platform == 'weixin' &&
                includePageTypeList.get(0) === 'index' && (
                  <li className="page-modal-li">
                    <a target="_blank" href={addUrl}>
                      <img
                        className="page-img"
                        src={require('../img/space.png')}
                      />
                      <p className="page-title">空白自建</p>
                    </a>
                  </li>
                )}
              {templateList &&
                templateList.map((info) => {
                  const editUrl =
                    Const.X_XITE_ADMIN_HOST +
                    `/editor/editor?action=create&&storeId=${storeId}&platform=` +
                    platform +
                    '&pageCode=' +
                    new Date().getTime() +
                    '&scene=onlineMall&pageType=' +
                    includePageTypeList.get(0) +
                    '&id=' +
                    info.templateCode +
                    '&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA%3D%3D' +
                    (info.userTpl ? '&userTpl=true' : '');
                  return (
                    <li className="page-modal-li">
                      <a href={editUrl} target="_blank">
                        <img
                          className="page-img"
                          src={
                            info.previewImage ||
                            '//oss-hz.qianmi.com/x-site/public/images/72c8bf80-6e09-11e8-b6cf-5f8b75912ff8.png'
                          }
                        />
                        <p className="page-title">{info.tplInfoName}</p>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}
