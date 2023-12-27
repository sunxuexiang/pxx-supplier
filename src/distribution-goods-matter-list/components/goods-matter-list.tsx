import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Const, DataGrid, noop } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { ShowImageModel } from 'biz';

const defaultImg = require('../image/video.png');

@Relax
export default class GoodsMatterList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      goodsMatterList: IList;
      showUrl: string;
      sortedInfo: IMap;
      dataSearch: Function;
      copyCoupon: Function;
      clickImg: Function;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    goodsMatterList: 'goodsMatterList',
    showUrl: 'showUrl',
    sortedInfo: 'sortedInfo',
    dataSearch: noop,
    clickImg: noop,
    init: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      goodsMatterList,
      sortedInfo,
      clickImg,
      showUrl,
      init
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          rowKey={(record) => record.id}
          dataSource={goodsMatterList.toJS()}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (currentPage, pageSize) => {
              init({ pageNum: currentPage - 1, pageSize: pageSize });
            }
          }}
          onChange={(pagination, filters, sorter) => {
            this._handleOnChange(pagination, filters, sorter);
          }}
        >
          <DataGrid.Column
            title="更新时间"
            dataIndex="updateTime"
            key="updateTime"
            width="118px"
            render={(text) => {
              return moment(text)
                .format(Const.TIME_FORMAT)
                .toString();
            }}
          />

          <DataGrid.Column
            title="素材"
            dataIndex="matter"
            key="matter"
            render={(text, record) => {
              return this._showMatter(text, record, clickImg);
            }}
          />

          <DataGrid.Column
            title="分享次数"
            width="120px"
            dataIndex="recommendNum"
            key="recommendNum"
            sorter={true}
            sortOrder={
              sortedInfo.get('columnKey') === 'recommendNum' &&
              sortedInfo.get('order')
            }
          />
        </DataGrid>
        <ShowImageModel
          url={showUrl}
          visible={showUrl != ''}
          clickImg={() => clickImg('')}
        />
      </div>
    );
  }

  /**
   *  展示素材信息
   * @param text
   * @param record
   */
  private _showMatter(text: string, record: any, clickImg: Function) {
    const { matterType, recommend } = record;
    let showHtml;
    //0: 图片   1: 视频
    if (matterType == 0) {
      //展示图片
      const matters = text.split(',');
      showHtml = matters.map((item, index) => {
        return (
          <div
            key={'image:' + index}
            className="smallitem"
            style={{ width: '50px' }}
          >
            <img src={item} />
            <p onClick={() => clickImg(item)}>预览</p>
          </div>
        );
      });
    } else {
      //展示视频
      showHtml = (
        <div className="smallitem" style={{ width: 'auto' }}>
          <img src={defaultImg} />
          <p onClick={() => this._videoDetail(text)}>预览</p>
        </div>
      );
    }

    return (
      <div>
        <div className="smallPic" style={{ width: '500px' }}>
          {showHtml}
        </div>
        <div>
          <p style={{ textAlign: 'left' }}>{recommend}</p>
        </div>
      </div>
    );
  }

  /**
   * 点击视频信息
   * @param videoUrl
   * @private
   */
  private _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };

  //点击排序回调
  _handleOnChange = (pagination, _filters, sorter) => {
    const { dataSearch, sortedInfo, init } = this.props.relaxProps;
    let currentPage = pagination.current;
    if (
      sorter.columnKey != sortedInfo.get('columnKey') ||
      sorter.order != sortedInfo.get('order')
    ) {
      dataSearch(sorter);
    } else {
      init({ pageNum: currentPage - 1, pageSize: 10, headInfo: null });
    }
  };
}
