import React from 'react';
import { Form, TreeSelect, Row, Col, Button, Tabs, Input, Switch } from 'antd';
import { FindArea } from 'qmkit';
import { AuthWrapper, noop } from 'qmkit';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@Relax
export default class AddressInfo extends React.Component<any, any> {
  props: {
    form: any;
    changeArea: Function;
    changeCityArea: Function;
    save: Function;
    cityAreaAry: any;
    five_pcsNumber: any;
    ten_pcsNumber: any;
    liswre: any;
    // wareId: any;
    relaxProps?: {
      wareId: String;
      wareIdInit: Function;
      numbersChnage: Function;
      areaAry: IList;
      openFlag: number;
      openFlagChange: Function;
    };
  };
  static relaxProps = {
    // wareId
    wareId: 'wareId',
    wareIdInit: noop,
    numbersChnage: noop,
    areaAry: 'areaAry',
    openFlag: 'openFlag',
    openFlagChange: noop
  };
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    const { areaAry } = this.props.relaxProps;
    console.log(areaAry.toJS(), 'areaAryareaAry');
    // this.setState({
    //   areaAry
    // })
  }
  render() {
    const {
      form,
      changeArea,
      save,
      cityAreaAry,
      changeCityArea,
      five_pcsNumber,
      ten_pcsNumber,
      liswre
      // wareId
    } = this.props;
    const {
      wareId,
      numbersChnage,
      areaAry,
      openFlag,
      openFlagChange
    } = this.props.relaxProps;
    const { getFieldDecorator } = form;
    const tProps = {
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择地区',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      style: {
        minWidth: 300
      }
    };
    // console.log(wareId, 'liswreliswre');
    // liswre.forEach(element => {

    // });
    // console.log(areaAry.toJS(),'areaAryareaAryareaAry');

    const couponCates = JSON.parse(localStorage.getItem('warePage')) || [];
    return (
      <div>
        <Tabs activeKey={wareId + ''} onChange={this.onChange}>
          {couponCates.map((coun) => {
            return (
              <TabPane tab={coun.wareName} key={coun.wareId + ''}>
                <FormItem
                  style={{
                    display: 'flex',
                    marginBottom: '12px'
                  }}
                  label="支持“免费店配”配送方式"
                >
                  {getFieldDecorator('openFlag', {
                    valuePropName: 'checked',
                    initialValue: openFlag === 1,
                    rules: [
                      {
                        required: true,
                        message: '请选择支持“免费店配”配送方式'
                      }
                    ]
                  })(
                    <Switch
                      checkedChildren="开"
                      unCheckedChildren="关"
                      onChange={(checked) => openFlagChange(checked)}
                    />
                  )}
                </FormItem>
                <Row
                  style={{
                    flexDirection: 'row',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Col
                    span={24}
                    style={{
                      flexDirection: 'row',
                      display: 'flex',
                      width: '50%',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ width: '244px' }}>
                      <Input
                        style={{ width: '60px', marginRight: '10px' }}
                        defaultValue={five_pcsNumber}
                        onChange={(value) => {
                          console.log(value.target.value, '5件起');
                          numbersChnage({
                            keys: 'five_pcsNumber',
                            value: value.target.value
                          });
                        }}
                      />
                      件起免运费设置覆盖区域：
                    </div>
                    <FormItem
                      style={{
                        display: 'inline-block',
                        marginBottom: 0,
                        width: '50%'
                      }}
                    >
                      {getFieldDecorator('destinationArea', {
                        initialValue: areaAry.toJS()
                      })(
                        <TreeSelect
                          {...tProps}
                          treeData={this._buildFreeAreaData('')}
                          onChange={(value, label) => {
                            changeArea(value, label);
                          }}
                          filterTreeNode={(input, treeNode) =>
                            treeNode.props.title
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                  {/* 商家入驻需求  此设置已被乡镇件设置替代  故注释 */}
                  {/* <Col
                    span={24}
                    style={{
                      flexDirection: 'row',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ width: '244px' }}>
                      <Input
                        style={{ width: '60px', marginRight: '10px' }}
                        defaultValue={ten_pcsNumber}
                        onChange={(value) => {
                          console.log(value.target.value, '10件起');
                          numbersChnage({
                            keys: 'ten_pcsNumber',
                            value: value.target.value
                          });
                        }}
                      />
                      件起免运费设置覆盖区域：
                    </div>
                    <FormItem
                      style={{
                        display: 'inline-block',
                        marginBottom: 0,
                        width: '37%'
                      }}
                    >
                      {getFieldDecorator('destinationAreaCity', {
                        initialValue: cityAreaAry
                          ? cityAreaAry.toJS()
                          : cityAreaAry
                      })(
                        <TreeSelect
                          {...tProps}
                          treeData={this._buildFreeAreaDataWithTenCases('')}
                          onChange={(value, label) => {
                            changeCityArea(value, label);
                          }}
                          filterTreeNode={(input, treeNode) =>
                            treeNode.props.title
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        />
                      )}
                    </FormItem>
                  </Col> */}
                </Row>
              </TabPane>
            );
          })}
        </Tabs>

        <AuthWrapper functionName="f_homeDelivery_save">
          <div className="bar-button">
            <Button
              onClick={() => save()}
              type="primary"
              style={{ marginRight: 10, marginLeft: 22 }}
            >
              保存
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }
  onChange = (e) => {
    const { wareIdInit } = this.props.relaxProps;
    wareIdInit(e);
  };
  /**
   * 构建包邮地区数据
   */
  _buildFreeAreaData = (id) => {
    return FindArea.findProvinceCity([]);
  };

  _buildFreeAreaDataWithTenCases = (id) => {
    return FindArea.findProvinceArea([]);
  };
}
