import React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Modal,
  Alert,
  Select
} from 'antd';
import { noop, Const, ExportModal, SelectGroup } from 'qmkit';
import styled from 'styled-components';
import { ExportForm } from 'biz';
import { exportParams } from '../webapi';
import moment from 'moment';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const FormItem = Form.Item;
const Option = Select.Option;
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      form: any;
      onExportModalShow: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  exportForm: any;

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    isModalVisible: false,
    isExport: false
  };

  static relaxProps = {
    onFormChange: noop,
    onSearch: noop,
    form: 'form',
    exportModalData: 'exportModalData',
    onExportModalShow: noop,
    onExportModalHide: noop
  };

  render() {
    const {
      onFormChange,
      onSearch,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const { startValue, endValue, isModalVisible, isExport } = this.state;
    const wareHouseVOPage =
      JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="活动名称"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'activityName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
          />
        </FormItem>

        <FormItem>
          <SelectBox>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="适用区域"
              defaultValue="0"
              showSearch
              onChange={(value) => {
                onFormChange({
                  field: 'wareId',
                  value: value != '0' ? value : null
                });
              }}
            >
              {wareHouseVOPage.map((ware) => {
                return (
                  <Option key={ware.wareId} value={ware.wareId}>
                    {ware.wareName}
                  </Option>
                );
              })}
            </SelectGroup>
          </SelectBox>
        </FormItem>

        <FormItem>
          <Input
            addonBefore="ERP编码"
            onChange={(e) => {
              const value = (e.target as any).value;
              onFormChange({
                field: 'erpGoodsInfoNo',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            搜索
          </Button>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                isModalVisible: true
              });
            }}
          >
            导出
          </Button>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => this._batchExport()}>
            明细导出
          </Button>
        </FormItem>
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          extraDom={
            <Alert
              message="操作说明："
              description="为保证效率,每次最多支持导出3000条明细，如需导出更多，请更换筛选条件后再次导出"
              type="info"
            />
          }
        />
        <Modal
          title="导出"
          okText="导出"
          visible={isModalVisible}
          onOk={() => this.exportDefault()}
          okButtonProps={{ loading: isExport }}
          onCancel={() => {
            this.setState({
              isModalVisible: false
            });
          }}
        >
          <Alert
            message="操作说明：
            1.根据商品的维度导出商品在某一时间段内所参加的所有活动内容；
            2.为保证效率，每次最多支持导出1000条记录。"
            type="info"
            showIcon
          />
          <ExportForm
            wrappedComponentRef={(exportForm) => (this.exportForm = exportForm)}
          />
        </Modal>
      </Form>
    );
  }

  exportDefault = async () => {
    let { isExport } = this.state;
    const { form } = this.props.relaxProps;
    if (isExport) {
      return message.error('正下载中，请耐心等待，忽在操作');
    }
    this.exportForm.props.form.validateFields(async (errs, values) => {
      if (errs) {
        return;
      }
      let erpvalue = values.erpvalue;
      if (erpvalue) {
        erpvalue = erpvalue.replace('，', ',');
      }
      const query = {
        erpGoodsInfoNo: values.erpvalue,
        startTime: values.activtyTime[0]
          ? moment(values.activtyTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        endTime: values.activtyTime[1]
          ? moment(values.activtyTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        queryTab: form.get('queryTab')
      };
      this.setState({ isExport: true });
      let res = await exportParams(query);
      this.setState({ isExport: false, isModalVisible: false });
      // 重置form中的数据
      this.exportForm.props.form.resetFields();
      if (res.size) {
        let blob = new Blob([res], { type: res.type });
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', '返鲸币活动.xlsx');
        document.body.appendChild(link);
        link.click(); // 点击
      }
    });
    return;
  };

  /**
   * 批量导出
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息'
    });
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'startTime', value: time });
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'endTime', value: time });
    this.onChange('endValue', value);
  };
}
