import { IList } from 'typings/globalType';
import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Form, Row, Col, Select } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 12,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

@Relax
export default class GoodsPropDetail extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      changePropVal: Function;
      propList: IList;
    };
  };

  static relaxProps = {
    changePropVal: noop,
    propList: 'propList'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { propList } = this.props.relaxProps;

    return (
      <div>
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          属性信息
          <span style={{ marginLeft: 10, fontSize: 10, color: '#86877F' }}>
            客户前台可根据属性筛选商品，不填写或填写错误，可能导致商品无法被找到，影响您的销售，请认真准确填写
          </span>
        </div>
        <div>
          <Form>
            {propList &&
              propList.map((detList) => {
                return (
                  <Row
                    type="flex"
                    justify="start"
                    key={detList.get(0).get('propId')}
                  >
                    {detList.map((det) => (
                      <Col
                        span={10}
                        key={det.get('propId') + det.get('cateId')}
                      >
                        <FormItem
                          {...formItemLayout}
                          label={det.get('propName')}
                        >
                          {this._getPropSelect(
                            det.get('goodsPropDetails'),
                            det.get('propId')
                          )}
                        </FormItem>
                      </Col>
                    ))}
                  </Row>
                );
              })}
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 获取属性值下拉框
   */
  _getPropSelect = (propValues, propId) => {
    const propVal = propValues.find((item) => item.get('select') === 'select');
    const selected = propVal ? propVal.get('detailId') : '0';
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        defaultValue={selected}
        onChange={(value) => this._onChange(propId, value)}
      >
        {propValues.map((item) => {
          return (
            <Option key={item.get('detailId')} value={item.get('detailId')}>
              {item.get('detailName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   *
   */
  _onChange = (propId, detailId) => {
    const { changePropVal } = this.props.relaxProps;
    changePropVal({ propId, detailId });
  };
}
