import React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Form,
  Select,
  Input,
  Button,
  DatePicker,
  message,
  Modal,
  Alert,
  Col
} from 'antd';
import { SelectGroup, noop, Const, util, ExportModal } from 'qmkit';
import { ExportForm } from 'biz';
import { List } from 'immutable';
import styled from 'styled-components';
import { exportParams } from '../webapi';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;
const smallformItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 18
  }
};
@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      customerLevels: TList;
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
    customerLevels: ['customerLevels'],
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
      customerLevels,
      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const { startValue, endValue, isModalVisible } = this.state;
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
                field: 'marketingName',
                value
              });
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="活动类型"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? '-1' : value;
              onFormChange({
                field: 'marketingSubType',
                value
              });
            }}
          >
            <Option value="-1">全部</Option>
            <Option value="0">满金额减</Option>
            <Option value="1">满数量减</Option>
            <Option value="7">订单满减</Option>
            <Option value="2">满金额折</Option>
            <Option value="3">满数量折</Option>
            <Option value="8">订单满折</Option>
            <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option>
            <Option value="6">订单满赠</Option>
          </SelectGroup>
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
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="目标客户"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'targetLevelId',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="-1">全平台客户</Option>
            {util.isThirdStore() && <Option value="0">全部等级</Option>}
            {customerLevels.map((v) => (
              <Option
                key={v.get('customerLevelId').toString()}
                value={v.get('customerLevelId').toString()}
              >
                {v.get('customerLevelName')}
              </Option>
            ))}
          </SelectGroup>
        </FormItem>
        {/* 商家入驻需求 此处需隐藏并设置disable 默认值 null（全部） */}
        <FormItem style={{ display: 'none' }}>
          <SelectBox>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="适用区域"
              defaultValue="0"
              showSearch
              disabled
              onChange={(value) => {
                onFormChange({
                  field: 'wareId',
                  value: value != '0' ? value : null
                });
              }}
            >
              {wareHouseVOPage.map((ware) => {
                return <Option value={ware.wareId}>{ware.wareName}</Option>;
              })}
            </SelectGroup>
          </SelectBox>
        </FormItem>
        {/* 商家入驻需求 第三方商家此处需隐藏并设置disable */}
        <FormItem style={util.isThirdStore() ? { display: 'none' } : {}}>
          <Input
            addonBefore="ERP编码"
            disabled={util.isThirdStore()}
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
      let base64 = new util.Base64();
      const token = (window as any).token || '';
      const form = {
        goodsErpNos: erpvalue,
        startTime: values.activtyTime[0]
          ? moment(values.activtyTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        endTime: values.activtyTime[1]
          ? moment(values.activtyTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : ''
      };
      let result = JSON.stringify({ ...form, token: token });
      let encrypted = base64.urlEncode(result);
      this.setState({ isExport: true });
      let res = await exportParams({ encrypted });
      this.setState({ isExport: false, isModalVisible: false });
      // 重置form中的数据
      this.exportForm.props.form.resetFields();
      if (res.size) {
        let blob = new Blob([res], { type: res.type });
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', '促销活动.xlsx');
        document.body.appendChild(link);
        link.click(); // 点击
      }
    });

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     // 参数加密
    //     let base64 = new util.Base64();
    //     erpvalue = erpvalue.replace('，',',')
    //     const token = (window as any).token;
    //     const form = {
    //       goodsErpNos: erpvalue,
    //       startTime: beginTime,
    //       endTime: endTime
    //     }

    //     if (token) {
    //       let result = JSON.stringify({ ...form, token: token });
    //       let encrypted = base64.urlEncode(result);
    //       console.log(result,'resultresult');
    //       console.log(encrypted)
    //       // 新窗口下载
    //       const exportHref =
    //         Const.HOST +
    //         `/marketing/export/params/${encrypted}`;
    //         // const exportHref =
    //         // Const.HOST +
    //         // `/marketing/export/params?token=${token}&goodsErpNo=${erpvalue}&startTime=${beginTime}&endTime=${endTime}`;
    //       console.log(exportHref,'exportHrefexportHref');
    //       window.open(exportHref);
    //     } else {
    //       message.error('请登录');
    //     }

    //     resolve(reject);
    //   }, 500);
    // });
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

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
}
