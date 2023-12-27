import React, { FC } from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

const CreatMessage: FC<any> = (props) => {
  const { form } = props;
  // const [uEditorValue, setUEditorValue] = useState({} as any);
  // const [content, setContent] = useState('<p>112</p>' as any);
  // const [chooseImgs, setChooseImgs] = useState([] as any);

  // useEffect(() => {
  //   console.log(uEditorValue.editor && uEditorValue.editor.getContent());
  // }, [uEditorValue]);

  // const handleClick = () => {};

  return (
    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
      <Form.Item label="名称">
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入名称'
            },
            {
              max: 40,
              message: '最大不能超过40个字符'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="标题">
        {form.getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入标题'
            },
            {
              max: 40,
              message: '最大不能超过40个字符'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="内容">
        {form.getFieldDecorator('content', {
          rules: [
            {
              required: true,
              message: '请输入内容'
            },
            {
              max: 200,
              message: '最大不能超过200个字符'
            }
          ]
        })(<TextArea />)}
      </Form.Item>
      {/* <Form.Item
        label="详情"
      >
        <UEditor
          ref={(UEditor) => {
            setUEditorValue((UEditor && UEditor.editor) || {});
          }}
          id="reg"
          height="320"
        />
      </Form.Item> */}
    </Form>
  );
};

export default Form.create({})(CreatMessage);
