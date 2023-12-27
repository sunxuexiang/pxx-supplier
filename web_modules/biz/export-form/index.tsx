import React from 'react';
import {
    Form,
    Input,
    DatePicker,
} from 'antd';
import { Const } from 'qmkit';

const smallformItemLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 18
    }
};

const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const FormItem = Form.Item;
class ExportForm extends React.Component {
    props: {
        form: any;
    };

    render(): React.ReactNode {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form style={{ marginTop: 20 }}>
                <FormItem {...smallformItemLayout} required={true} label="ERP编码">
                    {getFieldDecorator('erpvalue', {
                        rules: [{ required: true, message: '请输入ERP编码' }]
                    })(<TextArea rows={2} placeholder="可输入多个编码用, 分隔输入" />)}
                </FormItem>
                <FormItem {...smallformItemLayout} required={true} label="活动开始时间">
                    {getFieldDecorator('activtyTime', {
                        rules: [{ required: true, message: '请选择活动开始时间' }]
                    })(
                        <RangePicker
                            getCalendarContainer={() =>
                                document.getElementById('page-content')
                            }
                            allowClear={false}
                            format={Const.TIME_FORMAT}
                            placeholder={['起始时间', '结束时间']}
                            showTime
                        />
                    )}
                </FormItem>
            </Form>
        );
    }
}

const ExportForms = Form.create()(ExportForm);
export default ExportForms;
