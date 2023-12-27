import * as React from 'react';
import { Relax } from 'plume2';
import { Radio, Form } from 'antd';
import { IMap } from 'typings/globalType';
import { noop } from 'qmkit';
import { Map } from 'immutable';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@Relax
export default class AddedFlag extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goods: IMap;
      editGoods: Function;
      updateAddedFlagForm: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop,
    updateAddedFlagForm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(AddedFlagForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateAddedFlagForm } = relaxProps;
    return (
      <WrapperForm
        ref={form => updateAddedFlagForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class AddedFlagForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods } = this.props.relaxProps;
    return (
      <div>
        <Form>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            上下架
          </div>

          <FormItem>
            {getFieldDecorator('addedFlag', {
              rules: [
                {
                  required: true,
                  message: '请选择上下架状态'
                }
              ],
              onChange: this._editGoods.bind(this, 'addedFlag'),
              initialValue: goods.get('addedFlag')
            })(
              <RadioGroup>
                <Radio value={1}>上架</Radio>
                <Radio value={0}>下架</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    const goods = Map({
      [key]: e
    });
    editGoods(goods);
  };
}
