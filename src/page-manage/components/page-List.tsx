import * as React from 'react';
import { withRouter } from 'react-router';
import { Popconfirm, Input } from 'antd';
import moment from 'moment';
import { Relax } from 'plume2';
import { DataGrid, noop, Const, history } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = DataGrid;

@withRouter
@Relax
export default class PageList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      inputEdit: any;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      copy: Function;
      deletePage: Function;
      includePageTypeList: IList;
      onActivate: Function;
      onSetEdit: Function;
      storeId: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    inputEdit: 'inputEdit',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    copy: noop,
    deletePage: noop,
    includePageTypeList: 'includePageTypeList',
    onActivate: noop,
    onSetEdit: noop,
    storeId: 'storeId'
  };

  render() {
    const {
      loading,
      currentPage,
      pageSize,
      total,
      dataList,
      init,
      copy,
      deletePage,
      includePageTypeList,
      onActivate,
      inputEdit,
      onSetEdit,
      storeId
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="页面名称"
          key="title"
          className="th-first-col"
          dataIndex="title"
          render={(title, info: any) =>
            title ? (
              <div className="title-input">
                {info.activated && (
                  <span>
                    <span className="let-triangle" />
                    <span className="tpl-use">使用中</span>
                  </span>
                )}
                <span>
                  {' '}
                  {inputEdit.isShow && inputEdit.id === info._id ? (
                    <Input
                      onBlur={(e: any) =>
                        onSetEdit({
                          isShow: false,
                          id: info._id,
                          title: e.target.value
                        })
                      }
                      onPressEnter={(e: any) =>
                        onSetEdit({
                          isShow: false,
                          id: info._id,
                          title: e.target.value
                        })
                      }
                      defaultValue={title}
                    />
                  ) : (
                    <a
                      className="titleHover"
                      onClick={() => {
                        onSetEdit({ isShow: true, id: info._id, title: '' });
                      }}
                    >
                      {title}
                      <i className="anticon anticon-edit edit" />
                    </a>
                  )}
                </span>
              </div>
            ) : (
              '-'
            )
          }
        />
        <Column
          title="状态"
          key="status"
          dataIndex="status"
          render={(status) => {
            let statusStr;
            switch (status) {
              case 'notpublished':
                statusStr = (
                  <span style={{ color: '#f1c40f' }}>已修改未发布</span>
                );
                break;
              case 'draft':
                statusStr = <span style={{ color: '#f36a5a' }}>草稿</span>;
                break;
              default:
                statusStr = <span style={{ color: '#45be89' }}>已发布</span>;
            }
            return statusStr;
          }}
        />
        <Column
          title="修改时间"
          key="updateTime"
          dataIndex="updateTime"
          render={(contactName) =>
            contactName
              ? moment(contactName).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          }
        />
        <Column
          title="操作"
          render={(rowInfo) => {
            const editUrl =
              Const.X_XITE_ADMIN_HOST +
              '/editor/editor?action=edit&scene=onlineMall&platform=' +
              rowInfo.platform +
              '&pageCode=' +
              rowInfo.pageCode +
              '&pageType=' +
              rowInfo.pageType +
              '&storeId=' +
              storeId +
              '&sc=H4sIAAAAAAAAA0sxSg4uyS9KBQDJOKt4CAAAAA%3D%3D';
            const { pageCode, _id, pageType, platform } = rowInfo;
            return (
              <div>
                {/*<a*/}
                {/*  style={{ marginRight: 5 }}*/}
                {/*  onClick={() => {*/}
                {/*    history.push({*/}
                {/*      pathname: `/page-manage-drop/${pageCode}/${_id}/${pageType}/${platform}`*/}
                {/*    });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  投放*/}
                {/*</a>*/}
                <a target="_blank" href={editUrl} style={{ marginRight: 5 }}>
                  编辑
                </a>
                <Popconfirm
                  title="确定要复制吗?"
                  onConfirm={() => copy(rowInfo._id)}
                >
                  <a href="javascript:void(0);" style={{ marginRight: 5 }}>
                    复制
                  </a>
                </Popconfirm>
                <Popconfirm
                  title="确定要删除吗?"
                  onConfirm={() => deletePage(rowInfo)}
                >
                  <a href="javascript:void(0);" style={{ marginRight: 5 }}>
                    删除
                  </a>
                </Popconfirm>
                {includePageTypeList.get(0) === 'index' &&
                  rowInfo.status === 'published' &&
                  !rowInfo.activated && (
                    <Popconfirm
                      title="确定要设为首页吗?"
                      onConfirm={() => onActivate(rowInfo.pageCode)}
                    >
                      <a href="#">设为首页</a>
                    </Popconfirm>
                  )}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
