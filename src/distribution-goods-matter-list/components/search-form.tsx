import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Form } from 'antd';
import { InputGroupCompact, noop } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      head: IMap;
      onFormFieldChange: Function;
      init: Function;
    };
  };

  static relaxProps = {
    // chooseTitle: ['postTitle', 'chooseTitle'],
    form: 'form',
    head: 'head',
    onFormFieldChange: noop,
    init: noop
  };

  render() {
    const { form, onFormFieldChange, init } = this.props.relaxProps;

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <InputGroupCompact
              title={'分享次数'}
              start={form.get('recommendNumMin')}
              startMin={0}
              end={form.get('recommendNumMax')}
              endMin={0}
              onStartChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMin', value: val })
              }
              onEndChange={(val) =>
                onFormFieldChange({ key: 'recommendNumMax', value: val })
              }
            />
          </FormItem>

          <FormItem>
            <Button
              htmlType="submit"
              type="primary"
              onClick={(e) =>
              {
                e.preventDefault();
                init({ pageNum: 0, pageSize: 10, headInfo: null });
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
