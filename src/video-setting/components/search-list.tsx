import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import { DataGrid, noop, Const, AuthWrapper } from 'qmkit';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
import { Link } from 'react-router-dom';
import Moment from 'moment';

const { Column } = Table;

const TableBox = styled.div`
  padding-top: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onFormFieldChange: Function;
      onSearch: Function;
      delvideo: Function;
      updateStateById: Function;
      total: number;
      pageNum: number;
      goodsPage: IList;
    };
  };

  static relaxProps = {
    onFormFieldChange: noop,
    onSearch: noop,
    delvideo: noop,
    updateStateById: noop,
    goodsPage: 'goodsPage',
    // 每页展示数量
    pageSize: 'pageSize',
    // 当前页
    pageNum: 'pageNum',
    // 总数量
    total: 'total'
  };

  render() {
    const {
      pageSize,
      pageNum,
      total,
      delvideo,
      updateStateById,
      goodsPage,
      onSearch
    } = this.props.relaxProps;
    return (
      <TableBox>
        <DataGrid
          dataSource={goodsPage}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              onSearch({ pageNum: pageNum - 1, pageSize });
            }
          }}
          rowKey={'configType'}
        >
          <Column
            title="小视频名称"
            dataIndex="videoName"
            key="videoName"
            width={'30%'}
          />
          <Column
            title="创建时间"
            dataIndex="createTime"
            key="createTime"
            width={'30%'}
            render={(rowInfo: any) => {
              return (
                <span>
                  {rowInfo
                    ? Moment(rowInfo)
                        .format(Const.TIME_FORMAT)
                        .toString()
                    : ''}
                </span>
              );
            }}
          />
          <Column
            title="状态"
            dataIndex="state"
            key="state"
            width={'20%'}
            render={(rowInfo: any) => {
              return <span>{rowInfo == 0 ? '上架' : '下架'}</span>;
            }}
          />
          <Column
            title="操作"
            // dataIndex="switch"
            // key="configType"
            width={'20%'}
            render={(rowInfo: any) => {
              return (
                <div>
                  <AuthWrapper functionName="f_video_get">
                    <Link
                      to={`/video-set-detail/${rowInfo.videoId}`}
                      style={{ marginRight: 10 }}
                    >
                      查看
                    </Link>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_video_modify">
                    <Link
                      to={`/video-create/${rowInfo.videoId}`}
                      style={{ marginRight: 10 }}
                    >
                      编辑
                    </Link>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_video_delete">
                    <a
                      href="javascript:void(0);"
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        delvideo(rowInfo.videoId);
                      }}
                    >
                      删除
                    </a>
                  </AuthWrapper>
                  {/* <AuthWrapper functionName="f_video_state">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        updateStateById({
                          videoId: rowInfo.videoId,
                          state: rowInfo.state == 0 ? 1 : 0
                        });
                      }}
                    >
                      {rowInfo.state == 0 ? '下架' : '上架'}
                    </a>
                  </AuthWrapper> */}
                  {rowInfo.state == 0 && (
                    <AuthWrapper functionName="f_video_state">
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          updateStateById({
                            videoId: rowInfo.videoId,
                            state: 1
                          });
                        }}
                      >
                        下架
                      </a>
                    </AuthWrapper>
                  )}
                </div>
              );
            }}
          />
        </DataGrid>
      </TableBox>
    );
  }
}
