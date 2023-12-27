import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { RichText } from 'qmkit';
import { Card, Form } from 'antd';
import '../add-product.less';

const ProductDetail = forwardRef((props: any, ref) => {
  const { getFieldDecorator } = props.form;
  const [productContent, setContent] = useState('');
  useImperativeHandle(ref, () => ({
    deatailSubmit
  }));

  useEffect(() => {
    if (props.openEdit) {
      setContent(props.goodsDetail.goods.goodsDetail);
    }
  }, [props.goodsDetail]);
  const deatailSubmit = async () => {
    const info = await props.form.validateFieldsAndScroll();
    if (info.errors) {
      return false;
    } else {
      return info;
    }
  };
  return (
    <div className="new-product-card">
      <Card title="商品详情" headStyle={{ color: '#F56C1D' }} bordered={false}>
        <Form autoComplete="off">
          <Form.Item>
            {getFieldDecorator('goodsDetail', {
              initialValue: ''
            })(
              <div className="product-detail-box">
                <RichText
                  defaultContent={props.openEdit ? productContent : ''}
                  height={400}
                  contentChange={(data) => {
                    props.form.setFieldsValue({ goodsDetail: data });
                  }}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

const ProductDetailTemplate = Form.create()(ProductDetail);

export default ProductDetailTemplate;
