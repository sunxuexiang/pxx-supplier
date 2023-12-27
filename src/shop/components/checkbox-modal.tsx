import * as React from 'react';
import { Relax } from 'plume2';
import { Modal, Checkbox, Row, Input, message } from 'antd';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';
import * as _ from 'lodash';

const { Search } = Input;
@Relax
export default class CheckboxModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      changeFlag: false,
      filterWords: ''
    };
  }

  props: {
    relaxProps?: {
      modalType: number;
      checkboxVisible: boolean;
      checkBoxLoading: boolean;
      checkBoxDefaultVal: IList;
      allMarkets: IList;
      allStores: IList;
      closeCheckboxModal: Function;
      saveCheckbox: Function;
    };
  };

  static relaxProps = {
    modalType: 'modalType',
    checkboxVisible: 'checkboxVisible',
    checkBoxLoading: 'checkBoxLoading',
    allMarkets: 'allMarkets',
    allStores: 'allStores',
    checkBoxDefaultVal: 'checkBoxDefaultVal',
    closeCheckboxModal: noop,
    saveCheckbox: noop
  };

  render() {
    const { changeFlag, checkedValues, filterWords } = this.state;
    const {
      modalType,
      checkboxVisible,
      allMarkets,
      allStores,
      checkBoxDefaultVal,
      checkBoxLoading
    } = this.props.relaxProps;
    const options = [];
    let checkedLength = 0;
    let filterLength = 0;
    (modalType === 0 ? allMarkets : allStores).toJS().forEach((item) => {
      const res = {
        label: modalType === 0 ? item.marketName : item.tabName,
        value: modalType === 0 ? item.marketId : item.id
      };
      let hideflag = true;
      if (res.label.includes(filterWords) || !filterWords) {
        filterLength++;
        if (
          (changeFlag && checkedValues.includes(res.value)) ||
          (!changeFlag && checkBoxDefaultVal.includes(res.value))
        ) {
          checkedLength++;
        }
        hideflag = false;
      }
      options.push(
        <Row key={res.value} style={hideflag ? { display: 'none' } : {}}>
          <Checkbox value={res.value}>{res.label}</Checkbox>
        </Row>
      );
    });
    let checkAll = false;
    let indeterminate = false;
    if (checkedLength === filterLength) {
      checkAll = true;
    } else if (checkedLength > 0) {
      indeterminate = true;
    }

    return (
      <Modal
        maskClosable={false}
        title={`签约${modalType === 0 ? '批发市场' : '商城分类'}`}
        visible={checkboxVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOk}
        width={300}
        confirmLoading={checkBoxLoading}
        destroyOnClose
      >
        <Search
          placeholder="请输入搜索条件"
          onSearch={this.onSearch}
          style={{ width: 240 }}
        />
        {/* <div
          style={{
            padding: '4px 0',
            marginBottom: '4px',
            borderBottom: '1px solid #e8e8e8'
          }}
        >
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </div> */}
        <div style={{ maxHeight: 460, overflowY: 'auto' }}>
          <Checkbox.Group
            value={changeFlag ? checkedValues : checkBoxDefaultVal.toJS()}
            onChange={this.onChange}
          >
            {options}
          </Checkbox.Group>
        </div>
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeCheckboxModal } = this.props.relaxProps;
    this.setState({ checkedValues: [], filterWords: '', changeFlag: false });
    closeCheckboxModal();
  };

  /**
   * 保存弹框编辑
   * @private
   */
  _handleOk = () => {
    const {
      modalType,
      saveCheckbox,
      checkBoxDefaultVal
    } = this.props.relaxProps;
    const { checkedValues, changeFlag } = this.state;
    const values = changeFlag ? checkedValues : checkBoxDefaultVal;
    if (values.length > 1) {
      message.error('最多只能选择一个');
      return;
    } else if (values.length < 1) {
      message.error('请至少选择一个');
      return;
    }
    saveCheckbox(modalType, values, () => {
      this.setState({
        checkedValues: [],
        filterWords: '',
        changeFlag: false
      });
    });
  };

  /**
   * 选择复选框
   */
  onChange = (checkedValues) => {
    this.setState({ checkedValues, changeFlag: true });
  };

  // 全选
  onCheckAllChange = (e) => {
    const { filterWords, checkedValues, changeFlag } = this.state;
    const {
      allMarkets,
      allStores,
      modalType,
      checkBoxDefaultVal
    } = this.props.relaxProps;
    const currentValues = changeFlag ? checkedValues : checkBoxDefaultVal;
    let newCheckedValues = [];
    (modalType === 0 ? allMarkets : allStores).toJS().forEach((item) => {
      if (
        (modalType === 0 ? item.marketName : item.tabName).includes(filterWords)
      ) {
        newCheckedValues.push(modalType === 0 ? item.marketId : item.id);
      }
    });
    if (e.target.checked) {
      newCheckedValues = _.uniq([...currentValues, ...newCheckedValues]);
      this.setState({ checkedValues: newCheckedValues, changeFlag: true });
    } else {
      newCheckedValues = currentValues.filter(
        (item) => !newCheckedValues.includes(item)
      );
      this.setState({ checkedValues: newCheckedValues, changeFlag: true });
    }
  };

  //搜索框
  onSearch = (value) => {
    this.setState({ filterWords: value });
  };
}
