import * as React from 'react';
import { Relax } from 'plume2';
import {
  Checkbox,
  Input,
  Select,
  Button,
  Row,
  Col,
  Icon,
  Form,
  message
} from 'antd';
import { noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Map, fromJS } from 'immutable';

const Option = Select.Option;
const FormItem = Form.Item;

@Relax
export default class Spec extends React.Component<any, any> {
  WrapperForm: any;
  props: {
    relaxProps?: {
      isEditGoods: boolean;
      isProviderGoods: boolean;
      specSingleFlag: boolean;
      editSpecSingleFlag: Function;
      goodsSpecs: IList;
      editSpecName: Function;
      editSpecValues: Function;
      addSpec: Function;
      deleteSpec: Function;
      updateSpecForm: Function;
      doInitGoodList: Function;
      goodsList: IList;
    };
  };

  static relaxProps = {
    //是否是修改商品
    isEditGoods: 'isEditGoods',
    //是否是供货商商品
    isProviderGoods: 'isProviderGoods',
    // 是否为单规格
    specSingleFlag: 'specSingleFlag',
    // 修改是否为当单规格
    editSpecSingleFlag: noop,
    // 商品规格
    goodsSpecs: 'goodsSpecs',
    // 修改规格名称
    editSpecName: noop,
    // 修改规格值
    editSpecValues: noop,
    // 添加规格
    addSpec: noop,
    deleteSpec: noop,
    updateSpecForm: noop,
    doInitGoodList: noop,
    goodsList: 'goodsList'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SpecForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    // const { updateSpecForm } = relaxProps;
    return (
      <WrapperForm
        ref={(form) => (this['_form'] = form)}
        // ref={form => updateSpecForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class SpecForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateSpecForm } = this.props.relaxProps;
    updateSpecForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      specSingleFlag,
      goodsSpecs,
      isEditGoods,
      isProviderGoods,
      doInitGoodList,
      goodsList
    } = this.props.relaxProps;

    let goodsId;
    if (goodsList) {
      goodsId = goodsList.get(0).get('goodsId');
    }

    return (
      <div id="specSelect" style={{ marginBottom: 10 }}>
        <Form>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            规格设置
            {/*<Button type="primary" onClick={() => doInitGoodList(goodsId)}>*/}
            {/*同步最新库存*/}
            {/*</Button>*/}
          </div>
          <div style={styles.box}>
            <Checkbox
              onChange={this._editSpecFlag}
              checked={!specSingleFlag}
              disabled={isEditGoods && isProviderGoods}
            >
              设置商品多规格
            </Checkbox>
          </div>
          <div style={styles.bg}>
            {specSingleFlag ? null : (
              <Row>
                <Col offset={5}>
                  <p style={{ color: '#999', marginBottom: 5 }}>
                    可使用键盘“回车键”快速添加多个规格值
                  </p>
                </Col>
              </Row>
            )}
            {specSingleFlag
              ? null
              : goodsSpecs.map((item, index) => {
                  const specValues =
                    item.get('specValues').count() > 0
                      ? item
                          .get('specValues')
                          .map((item) => item.get('detailName'))
                          .toJS()
                      : [];
                  return (
                    <div key={item.get('specId')} style={{ marginBottom: 20 }}>
                      <Row type="flex" justify="start" align="top">
                        <Col span={3}>
                          <span
                            style={{
                              color: 'red',
                              fontFamily: 'SimSun',
                              marginRight: '4px',
                              fontSize: '12px',
                              float: 'left'
                            }}
                          >
                            *
                          </span>
                          <FormItem>
                            {getFieldDecorator('spec_' + item.get('specId'), {
                              rules: [
                                {
                                  required: true,
                                  whitespace: true,
                                  message: '请填写规格'
                                },
                                {
                                  min: 1,
                                  max: 10,
                                  message: '最多10个字符'
                                },
                                {
                                  // 重复校验,
                                  validator: (_rule, specsName, callback) => {
                                    if (!specsName) {
                                      callback();
                                      return;
                                    }
                                    //   获得表单其他列的规格名称，
                                    goodsSpecs.forEach((value, i) => {
                                      if (i != index) {
                                        value.get('specName') == specsName
                                          ? callback(new Error('规格名称重复'))
                                          : callback();
                                      }
                                    });
                                    callback();
                                  }
                                }
                              ],
                              onChange: this._editSpecName.bind(
                                this,
                                item.get('specId')
                              ),
                              initialValue: item.get('specName')
                            })(
                              <Input
                                disabled={isEditGoods && isProviderGoods}
                                placeholder="请输入规格"
                                style={{ width: '90%' }}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col
                          span={2}
                          style={{ marginTop: 2, textAlign: 'center' }}
                        >
                          <Button
                            onClick={() => this._deleteSpec(item.get('specId'))}
                          >
                            删除
                          </Button>
                        </Col>
                        <Col span={10}>
                          <span
                            style={{
                              color: 'red',
                              fontFamily: 'SimSun',
                              marginRight: '4px',
                              fontSize: '12px',
                              float: 'left'
                            }}
                          >
                            *
                          </span>
                          <FormItem>
                            {getFieldDecorator(
                              'specval_' + item.get('specId'),
                              {
                                rules: [
                                  {
                                    required: true,
                                    message: '请填写规格值'
                                  },
                                  {
                                    validator: (_rule, value, callback) => {
                                      if (!value) {
                                        callback();
                                        return;
                                      }

                                      if (value.length > 0) {
                                        const valueList = fromJS(value);
                                        let overLen = false;
                                        let whitespace = false;
                                        let duplicated = false;

                                        valueList.forEach((v, k) => {
                                          const trimValue = v.trim();
                                          if (!trimValue) {
                                            whitespace = true;
                                            return false;
                                          }
                                          if (v.length > 20) {
                                            overLen = true;
                                            return false;
                                          }

                                          // 重复校验
                                          const duplicatedIndex = valueList.findIndex(
                                            (v1, index1) =>
                                              index1 != k &&
                                              v1.trim() === trimValue
                                          );
                                          if (duplicatedIndex > -1) {
                                            duplicated = true;
                                          }
                                        });

                                        if (whitespace) {
                                          callback(
                                            new Error('规格值不能为空格字符')
                                          );
                                          return;
                                        }
                                        if (overLen) {
                                          callback(
                                            new Error('每项值最多支持20个字符')
                                          );
                                          return;
                                        }
                                        if (duplicated) {
                                          callback(new Error('规格值重复'));
                                          return;
                                        }
                                      }

                                      if (value.length > 20) {
                                        callback(
                                          new Error('最多支持20个规格值')
                                        );
                                        return;
                                      }

                                      callback();
                                    }
                                  }
                                ],
                                onChange: this._editSpecValue.bind(
                                  this,
                                  item.get('specId')
                                ),
                                initialValue: specValues
                              }
                            )(
                              <Select
                                disabled={isEditGoods && isProviderGoods}
                                mode="tags"
                                getPopupContainer={() =>
                                  document.getElementById('specSelect')
                                }
                                style={{ width: '90%' }}
                                placeholder="请输入规格值"
                                notFoundContent="暂无规格值"
                                tokenSeparators={[',']}
                              >
                                {this._getChildren(item.get('specValues'))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  );
                })}

            {specSingleFlag || (isEditGoods && isProviderGoods) ? null : (
              <Button onClick={this._addSpec}>
                <Icon type="plus" />
                添加规格
              </Button>
            )}
          </div>
        </Form>
      </div>
    );
  }

  /**
   * 获取规格值转为option
   */
  _getChildren = (specValues: IList) => {
    const children = [];
    specValues.forEach((item) => {
      children.push(
        <Option key={item.get('detailName')}>{item.get('detailName')}</Option>
      );
    });
    return children;
  };

  /**
   * 设置是否为单规格
   */
  _editSpecFlag = (e) => {
    const { editSpecSingleFlag, updateSpecForm } = this.props.relaxProps;
    updateSpecForm(this.props.form);
    editSpecSingleFlag(!e.target.checked);
  };

  /**
   * 修改规格名称
   */
  _editSpecName = (specId: number, e) => {
    const { editSpecName, updateSpecForm } = this.props.relaxProps;
    const specName = e.target.value;
    updateSpecForm(this.props.form);
    editSpecName({ specId, specName });
  };

  /**
   * 修改规格值
   */
  _editSpecValue = (specId: number, value: string) => {
    const {
      editSpecValues,
      goodsSpecs,
      updateSpecForm
    } = this.props.relaxProps;
    // 找到原规格值列表
    const spec = goodsSpecs.find((spec) => spec.get('specId') == specId);
    const oldSpecValues = spec.get('specValues');
    let specValues = fromJS(value);
    specValues = specValues.map((item) => {
      const ov = oldSpecValues.find((ov) => ov.get('detailName') == item);
      const isMock = !ov || ov.get('isMock') === true;
      const valueId = ov ? ov.get('specDetailId') : this._getRandom();
      return Map({
        isMock: isMock,
        specDetailId: valueId,
        detailName: item
      });
    });
    updateSpecForm(this.props.form);
    editSpecValues({ specId, specValues });
  };

  /**
   * 添加规格
   */
  _addSpec = () => {
    const { addSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() >= 5) {
      message.error('最多添加5个规格项');
      return;
    }
    updateSpecForm(this.props.form);
    addSpec();
  };

  _deleteSpec = (specId: number) => {
    const { deleteSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() <= 1) {
      message.error('至少保留1个规格项');
      return;
    }
    updateSpecForm(this.props.form);
    deleteSpec(specId);
  };

  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt(
      Math.random()
        .toString()
        .substring(2, 18)
    );
  };
  r;
}

const styles = {
  box: {
    padding: 10,
    paddingLeft: 20
  },
  bg: {
    padding: 20,
    paddingTop: 0
  }
} as any;
