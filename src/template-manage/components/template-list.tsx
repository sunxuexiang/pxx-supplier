import * as React from 'react';
import { Relax } from 'plume2';
import { Popconfirm, Input } from 'antd';
import { List, Map } from 'immutable';
import { noop, Const } from 'qmkit';
declare type IList = List<any>;
declare type IMap = Map<any, any>;

@Relax
export default class TemplateList extends React.Component {
  props: {
    relaxProps?: {
      dataList: IList;
      inputEdit: IMap;
      includePageTypeList: string;
      platform: string;
      onDelTemplate: Function;
      onCopyTemplate: Function;
      onSetEdit: Function;
      storeId: number;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    inputEdit: 'inputEdit',
    includePageTypeList: 'includePageTypeList',
    platform: 'platform',
    onDelTemplate: noop,
    onCopyTemplate: noop,
    onSetEdit: noop,
    storeId: 'storeId'
  };

  render() {
    const {
      dataList,
      inputEdit,
      platform,
      onDelTemplate,
      onCopyTemplate,
      onSetEdit,
      storeId
    } = this.props.relaxProps;

    return (
      <div className="template-container">
        {dataList.map((item) => {
          let editor = `${
            Const.X_XITE_ADMIN_HOST
            }/editor/editor?action=create&platform=${platform}&pageCode=${new Date().getTime()}&scene=onlineMall&pageType=${item.get(
              'pageType'
            )}&storeId=${storeId}&id=${item.get(
              'id'
            )}&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA%3D%3D`;
          if (item.get('userTpl')) {
            editor += '&userTpl=true';
          }
          const edit = `${Const.X_XITE_ADMIN_HOST}/uerTpl/edit?id=${item.get(
            '_id'
          )}&storeId=${storeId}&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA==`;
          return (
            <div className="template-wrap" key={item.get('_id')}>
              <div className="template">
                <a href={editor} target="_blank">
                  <div className="thumb">
                    <img
                      src={
                        item.get('previewImage') ||
                        'http://oss-hz.qianmi.com/x-site/public/images/72c8bf80-6e09-11e8-b6cf-5f8b75912ff8.png'
                      }
                    />
                  </div>
                </a>
                <div className="info">
                  <div className="src-tag">
                    {item.get('userTpl') ? '原创' : '官方'}
                  </div>
                  <div className="template-name">
                    {inputEdit.get('isShow') &&
                      inputEdit.get('id') === item.get('_id') ? (
                        <Input
                          className="ant-input"
                          onBlur={(e: any) =>
                            onSetEdit({
                              isShow: false,
                              id: item.get('_id'),
                              title: e.target.value
                            })
                          }
                          onPressEnter={(e: any) =>
                            onSetEdit({
                              isShow: false,
                              id: item.get('_id'),
                              title: e.target.value
                            })
                          }
                          defaultValue={item.get('name')}
                        />
                      ) : item.get('userTpl') ? (
                        <div
                          className="template-name-edit"
                          onClick={() => {
                            onSetEdit({ isShow: true, id: item.get('_id') });
                          }}
                        >
                          <span>{item.get('name')}</span>
                          <a>
                            <i className="anticon anticon-edit edit" />
                          </a>
                        </div>
                      ) : (
                          <div className="template-name-edit">
                            <span>{item.get('name')}</span>
                          </div>
                        )}
                  </div>
                </div>
                {item.get('userTpl') && item.get('platform') === 'weixin' ? (
                  <div className="actions apply">
                    <a href={editor} target="_blank">
                      <div className="action apply" title="应用模板" />
                    </a>
                    <a href={edit} target="_blank">
                      <div className="action edit" title="编辑模板" />
                    </a>
                    <Popconfirm
                      title="确定要复制吗?"
                      onConfirm={() => onCopyTemplate(item.get('userTplInfo'))}
                    >
                      <div className="action copy" title="复制模板" />
                    </Popconfirm>
                    <Popconfirm
                      title="确定要删除吗?"
                      onConfirm={() => onDelTemplate(item.get('_id'))}
                    >
                      <div className="action del" title="删除模板" />
                    </Popconfirm>
                  </div>
                ) : (
                    <div className="actions apply">
                      <a href={editor} target="_blank">
                        <div className="action apply" title="应用模板" />
                      </a>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
