import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Pagination, Row, Col } from 'antd';
import Input from 'antd/lib/input/Input';

const videoImg = require('../img/video.jpg');

declare type IList = List<any>;

@Relax
export default class VideoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      videoList: IList; //视频列表
      queryVideoPage: Function; //初始化
      currentPage: number; //分页
      total: number; //分页
      pageSize: number; //分页
      showVideoDetail: Function;
    };
  };

  static relaxProps = {
    videoList: 'videoList',
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    queryVideoPage: noop,
    showVideoDetail: noop
  };

  render() {
    const {
      videoList,
      currentPage,
      total,
      pageSize,
      showVideoDetail
    } = this.props.relaxProps;
    return (
      <div className="vt-list">
        <Row gutter={16}>
          {(videoList || fromJS([])).map((item, index) => {
            return (
              <Col
                className="vt-list-item"
                span={6}
                key={item.get('resourceId')}
                onClick={() => showVideoDetail(item, index)}
              >
                <img className="vt-list-img" src={videoImg} alt="" />
                <p title={item.get('resourceName')}>
                  {item.get('resourceName')}
                </p>
              </Col>
            );
          })}
        </Row>
        {(videoList || fromJS([])).size == 0 ? (
          <div className="ant-table-placeholder">
            <span>
              <i className="anticon anticon-frown-o" />
              暂无数据
            </span>
          </div>
        ) : (
          <div>
            <Pagination
              onChange={(pageNum, pageSize) =>
                this._toCurrentPage(pageNum, pageSize)
              }
              current={currentPage}
              total={total}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    );
  }

  /**
   * 分页
   * @param pageNum
   * @param pageSize
   * @private
   */
  _toCurrentPage = (pageNum: number, pageSize: number) => {
    const { queryVideoPage } = this.props.relaxProps;
    //如果选中分类，则分页要在该分类下进行
    queryVideoPage({ pageNum: pageNum - 1, pageSize: pageSize });
  };
}
