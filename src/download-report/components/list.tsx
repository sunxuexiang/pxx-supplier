import React from 'react';

import { Popconfirm, Pagination } from 'antd';
import { IMap, Relax } from 'plume2';
import moment from 'moment';

import { noop, cache } from 'qmkit';
const noneData = require('../images/nodata.png');

const REPORT_TYPE = {
  FLOW: '流量报表',
  TRADE: '交易报表',
  GOODS_TRADE: '商品销售报表',
  GOODS_CATE_TRADE: '商品分类销售报表',
  GOODS_BRAND_TRADE: '商品品牌销售报表',
  CUSTOMER_GROW: '客户增长报表',
  CUSTOMER_TRADE: '客户订货报表',
  CUSTOMER_LEVEL_TRADE: '客户等级交易报表',
  CUSTOMER_AREA_TRADE: '客户地区交易报表',
  SALESMAN_TRADE: '业务员业绩报表',
  SALESMAN_CUSTOMER: '业务员获客报表',
  STORE_CATE_TRADE: '店铺分类销售报表'
};

const EXPORT_STATUS = {
  WAIT_EXPORT: '生成中',
  SUCCESS_EXPORT: '已完成',
  ERROR_EXPORT: '任务失败'
};

@Relax
export default class ReportList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      reportPage: IMap;
      getDownloadReportByPage: Function;
      deleteDownloadReport: Function;
    };
  };

  static relaxProps = {
    reportPage: 'reportPage',
    getDownloadReportByPage: noop,
    deleteDownloadReport: noop
  };

  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const {
      reportPage,
      getDownloadReportByPage,
      deleteDownloadReport
    } = this.props.relaxProps;

    const viewList = reportPage.get('data')
      ? reportPage.get('data').toJS()
      : [];
    //const viewList = [];

    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));

    const accountName = loginInfo && loginInfo.accountName;
    return viewList && viewList.length > 0 ? (
      <div>
        {viewList &&
          viewList.map((item, k) => {
            return (
              <div key={k} style={styles.item}>
                <div style={styles.lines}>
                  <span style={styles.leftCon}>下载请求时间：</span>
                  <span>
                    {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
                <div style={styles.lines}>
                  <span style={styles.leftCon}>报表类型：</span>
                  <span>{REPORT_TYPE[item.typeCd]}</span>
                </div>
                <div style={styles.lines}>
                  <span style={styles.leftCon}>状态：</span>
                  <span style={styles.blue}>
                    {EXPORT_STATUS[item.exportStatus]}
                  </span>
                </div>
                <div style={styles.lines}>
                  <span style={styles.leftCon}>请求人：</span>
                  <span>{accountName}</span>
                </div>
                <div style={styles.lines}>
                  <span style={styles.leftCon}>数据筛选时间：</span>
                  <span>
                    {item.beginDate} - {item.endDate}
                  </span>
                </div>
                {item.exportStatus == 'SUCCESS_EXPORT' && (
                  <div style={styles.lines}>
                    <span style={styles.leftCon}>文件名称：</span>
                    {item.filePath.split(',').map((item, fileIndex) => {
                      let dom = (
                        <a target="_blank" href={item} key={fileIndex}>
                          {item.substring(
                            item.lastIndexOf('/') + 1,
                            item.length
                          )}
                        </a>
                      );
                      if (fileIndex != 0) {
                        return <span>，{dom}</span>;
                      } else {
                        return <span>{dom}</span>;
                      }
                    })}
                  </div>
                )}
                {item.exportStatus != 'WAIT_EXPORT' && (
                  <Popconfirm
                    placement="bottomRight"
                    title="确定删除该文件？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => deleteDownloadReport(item.id)}
                  >
                    <a className="report-close">×</a>
                  </Popconfirm>
                )}
              </div>
            );
          })}
        <Pagination
          onChange={(pageNum, pageSize) =>
            getDownloadReportByPage(pageNum, pageSize)
          }
          current={reportPage.get('pageNum')}
          total={reportPage.get('total')}
          pageSize={reportPage.get('pageSize')}
        />
      </div>
    ) : (
      <div style={styles.nonImage}>
        <img src={noneData} alt="" />
      </div>
    );
  }
}

const styles = {
  item: {
    border: '1px solid #ddd',
    borderRadius: 3,
    padding: 20,
    marginBottom: 20,
    position: 'relative'
  } as any,
  leftCon: {
    width: 90,
    textAlign: 'right'
  },
  lines: {
    padding: '5px 0'
  },
  blue: {
    color: '#F56C1D'
  },
  closeBtn: {},
  download: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 2
  },
  nonImage: {
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: 'rgb(250, 250, 250)',
    marginTop: 10
  }
} as any;
