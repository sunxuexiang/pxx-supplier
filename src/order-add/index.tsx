import React from 'react';
import PropTypes from 'prop-types';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import CustomerInfo from './components/customer-info';
import GoodsList from './components/goods-list';
import { Button, Breadcrumb, Select } from 'antd';
declare let window: any;

const Option = Select.Option;

import ExtraInfo from './components/extra-info';
import Form from 'antd/lib/form/Form';

class CreateOrder extends React.Component<any, any> {
  store: AppStore;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.store = ctx['_plume$Store'];
  }
  // componentDidMount() {
  //   console.log(window.location)
  // 	let url = window.location.pathname;
  //   console.log(url);
  // }
  // componentWillMount () {
  //   // 拦截判断是否离开当前页面
  //   window.addEventListener('beforeunload', this.beforeunload);
  // }
  // componentWillUnmount () {
  // 	let url = window.location.pathname;
  //   console.log(url);
  //   console.log(window)
  //   // 销毁拦截判断是否离开当前页面
  //   window.removeEventListener('beforeunload', this.beforeunload);
  // }
  // beforeunload (e) {
  //   let confirmationMessage = '你确定离开此页面吗?';
  //   (e || window.event).returnValue = confirmationMessage;
  //   return confirmationMessage;
  // }
  render() {
    return (
      <AuthWrapper functionName="f_valet">
        <div>
          {/*面包屑*/}
          <BreadCrumb thirdLevel={this.props.edit && true}>
            {/* {this.props.edit ? <Breadcrumb.Item>订单列表</Breadcrumb.Item> : null} */}
            <Breadcrumb.Item>
              {this.props.edit ? '修改订单' : ''}
            </Breadcrumb.Item>
          </BreadCrumb>
          <Form>
            <div className="container">
              <Headline title={this.props.edit ? '修改订单' : '代客下单'} />

              {/*客戶信息*/}
              <CustomerInfo
                form={this.props.form}
                {...{
                  selectedCustomerInfo: this.store
                    .state()
                    .get('selectedCustomerInfo'),
                  flushStatus: this.props.flushStatus,
                  selectedAddrId: this.store.state().get('selectedAddrId'),
                  edit: this.props.edit
                }}
              />
              <div>
                <strong style={styles.title}>仓库: </strong>
                <Select
                  style={{ width: '148px' }}
                  showSearch
                  placeholder="请选择一个仓库"
                  notFoundContent="暂无仓库信息"
                  // defaultValue="1"
                  onChange={(value) => this._setWareHouse(value)}
                >
                  {this.store
                    .state()
                    .get('wareHouseList')
                    .map((item) => {
                      return (
                        <Option key={item.get('wareId')} value={item}>
                          {item.get('wareName')}
                        </Option>
                      );
                    })}
                </Select>
              </div>

              {/* <strong style={styles.title}>商品清单: </strong> */}
              <strong style={styles.title}>商品清单: </strong>

              {/*商品列表*/}
              <GoodsList
                form={this.props.form}
                {...{
                  selectedCustomerId: this.store
                    .state()
                    .get('selectedCustomerId'),
                  flushStatus: this.props.flushStatus,
                  edit: this.props.edit
                }}
              />

              {/*附件信息*/}
              <ExtraInfo
                form={this.props.form}
                {...{
                  flushStatus: this.props.flushStatus,
                  sperator: this.props.sperator,
                  selectedInvoiceAddrId: this.props.selectedInvoiceAddrId
                }}
              />
            </div>
          </Form>
        </div>
      </AuthWrapper>
    );
  }
  _setWareHouse = (value) => {
    let vl = value.toJS();
    console.log(value);
    console.log(vl);
    this.setState({
      wareId: vl.wareId
    });
    sessionStorage.setItem('wareId', vl.wareId);
    const { setSecletWareHouse } = this.store;
    setSecletWareHouse(value);
  };
}

const OrderForm = Form.create({})(CreateOrder);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderRepresentCustomer extends React.Component<any, any> {
  store: AppStore;
  _form: any;

  componentWillMount() {
    const { tid } = this.props.match.params;
    this.store.initInvoiceSwitch();
    if (tid) {
      this.store.editInit(tid);
    }
    this.setState({
      edit: tid ? true : false
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      flushStatus: 0,
      edit: false,
      wareId: 1
    };
  }

  render() {
    return (
      <div style={{ paddingBottom: 50 }}>
        <OrderForm
          ref={(form) => (this._form = form)}
          {...{
            flushStatus: this.state.flushStatus,
            edit: this.state.edit,
            sperator: this.store.state().getIn(['extra', 'sperator']),
            selectedInvoiceAddrId: this.store
              .state()
              .get('selectedInvoiceAddrId')
          }}
        />
        <div className="bar-button">
          <Button
            onClick={() => this._createOrder()}
            type="primary"
            htmlType="submit"
            loading={this.state.submitting}
          >
            保存
          </Button>
          &nbsp;&nbsp;
          <Button
            htmlType="submit"
            onClick={() => {
              this.props.history.go(-1);
            }}
          >
            取消
          </Button>
          &nbsp;&nbsp;
          <Button
            htmlType="submit"
            loading={this.state.submitting}
            onClick={() => this._peImport()}
          >
            重新导入
          </Button>
        </div>
      </div>
    );
  }
  // 重新导入
  _peImport() {
    const { clearOrdersy, bachDelete } = this.store;
    this._form.validateFields((err) => {
      if (!err) {
        bachDelete();
        // clearOrdersy();
        // this.props.history.go(0);
      } else {
        clearOrdersy();
        this.setState({
          flushStatus: Math.random()
        });
      }
    });
  }

  _createOrder = () => {
    const { onCreateOrder } = this.store;
    this._form.validateFields((err) => {
      if (!err) {
        onCreateOrder(this.state.edit);
      } else {
        this.setState({
          flushStatus: Math.random()
        });
      }
    });
  };
}

const styles = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  }
} as any;
