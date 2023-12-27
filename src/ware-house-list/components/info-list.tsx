import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, Const, FindArea, noop } from 'qmkit';
import { Modal, Table, Tooltip } from 'antd';
import Moment from 'moment';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;
const WARE_HOUSE_TYPE = {
  0: '线上仓',
  1: '门店仓',
  null: '-'
};
@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      onDefault: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onDelete: noop,
    onEdit: noop,
    queryPage: noop,
    onDefault: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      checkedIds,
      onSelect,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="wareId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        // rowSelection={{
        //   type: 'checkbox',
        //   selectedRowKeys: checkedIds.toJS(),
        //   onChange: (checkedRowKeys) => {
        //     onSelect(checkedRowKeys);
        //   }
        // }}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      title: '序号',
      render: (_text, _row, index) => index + 1
    },
    {
      key: 'wareCode',
      dataIndex: 'wareCode',
      title: '仓库编码'
    },
    {
      key: 'wareName',
      dataIndex: 'wareName',
      title: '仓库名称'
    },
    {
      key: 'destinationArea',
      dataIndex: 'destinationArea',
      title: '覆盖区域',
      width: 500,
      render: (text, record) => {
        let arrCity = FindArea.getProvinceNameAndCityName(text);
        const cityData = arrCity.split('，');
        const areaData = cityData.filter((el) => {
          return el !== '请选择所在地区';
        });
        // arrCity.filter(item=>{
        //   return
        // })
        console.warn(areaData, '8888888');

        return (
          <div className="td-text-wrapper">
            <Tooltip title={areaData.join(',')}>
              <span>{areaData.join(',')}</span>
            </Tooltip>
          </div>
        );
      }
    },
    {
      key: 'wareHouseType',
      dataIndex: 'wareHouseType',
      title: '仓库类型',
      render: (text, record) => {
        return WARE_HOUSE_TYPE[text];
        // FindArea.findProviceName(record.provinceId) +
        // FindArea.findCityName(record.cityId) +
        // FindArea.findAreaName(record.areaId) +
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_ware_house_edit'}>
          <a
            style={styles.edit}
            onClick={() => {
              this.props.relaxProps.onEdit(
                rowInfo.wareId,
                rowInfo.wareHouseType
              );
            }}
          >
            编辑
          </a>
        </AuthWrapper>
        {rowInfo.defaultFlag == 0 ? (
          <>
            <AuthWrapper functionName={'f_ware_house_delete'}>
              <a
                style={styles.edit}
                onClick={() => this._onDelete(rowInfo.wareId)}
              >
                删除
              </a>
            </AuthWrapper>
            <AuthWrapper functionName={'f_ware_house_default'}>
              <a onClick={() => this._onDefault(rowInfo.wareId)}>设为默认</a>
            </AuthWrapper>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    // const { onEdit } = this.props.relaxProps.;
    // onEdit(id);
  };

  /**
   * 设为默认
   */
  _onDefault = (id) => {
    const { onDefault } = this.props.relaxProps;
    onDefault(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };
}
