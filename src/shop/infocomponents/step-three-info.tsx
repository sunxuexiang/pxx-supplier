import React from 'react';
import { Modal, DatePicker, Radio, Form, Input, Select } from 'antd';
import { List } from 'immutable';
import moment from 'moment';
import styled from 'styled-components';
import { DataGrid } from 'qmkit';
import { Relax, IMap } from 'plume2';
declare type IList = List<any>;

const { Column } = DataGrid;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

const Content = styled.div`
  padding-bottom: 20px;
`;

const Red = styled.span`
  color: #e73333;
`;
const H2 = styled.h2`
  color: #333333;
  font-size: 14px;
  display: inline;
  font-weight: 400;
`;

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
  margin-right: 20px;
  font-size: 12px;
`;
const TableBox = styled.div`
  padding-top: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;
const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

const formItemLayout = {
  labelCol: {
    span: 1,
    xs: { span: 1 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 1,
    xs: { span: 1 },
    sm: { span: 6 }
  }
};

@Relax
export default class StepThree extends React.Component<any, any> {
  props: {
    relaxProps?: {
      company: IMap;
      checkInfo: IMap;
      otherBrands: IList;
      selfWareHouses: IList;
    };
  };

  static relaxProps = {
    company: 'company',
    checkInfo: 'checkInfo',
    selfWareHouses: 'selfWareHouses'
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const { company, selfWareHouses } = this.props.relaxProps;
    const cateList = company.get('cateList').toJS();
    const brandList = company.get('brandList').toJS();
    const marketList = company.get('marketList').toJS();
    const storeList = company.get('storeList').toJS();
    const storeInfo = company.get('storeInfo');

    const companyType = company.get('companyType');
    const chooseWareHouseIds = company.get('wareHourseIds'); //已选的分仓
    const erpId = company.get('info').get('erpId');

    let children = [];
    if (
      selfWareHouses &&
      selfWareHouses.toJS() &&
      selfWareHouses.toJS().length > 0
    ) {
      selfWareHouses.map((s) => {
        children.push(
          <Option key={s.get('wareId')} value={s.get('wareId')}>
            {s.get('wareName')}
          </Option>
        );
      });
    }

    return (
      <div id="contract-table">
        <Content>
          <div>
            <Red>*</Red>
            <H2>签约批发市场</H2>
            <GreyText>已签约{marketList.length}个类目</GreyText>
          </div>
          <TableBox>
            <DataGrid
              dataSource={marketList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="relationValue"
            >
              <Column
                title="批发市场名称"
                align="left"
                dataIndex="relationName"
                key="relationName"
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约商城分类</H2>
            <GreyText>已签约{storeList.length}个商城分类</GreyText>
          </div>
          <TableBox>
            <DataGrid
              dataSource={storeList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="relationValue"
            >
              <Column
                title="商城分类"
                dataIndex="relationName"
                align="left"
                key="relationName"
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约类目</H2>
            <GreyText>
              已签约{cateList ? cateList.length : 0}个类目 最多可签约200个类目
            </GreyText>
          </div>
          <TableBox>
            <DataGrid
              dataSource={cateList}
              scroll={{ y: 240 }}
              pagination={false}
              rowKey="contractCateId"
            >
              <Column
                title="类目"
                dataIndex="cateName"
                key="cateName"
                width="15%"
              />
              <Column
                title="上级类目"
                dataIndex="parentGoodCateNames"
                key="parentGoodCateNames"
                width="20%"
              />
              <Column
                title="类目扣率"
                dataIndex="cateRate"
                key="cateRate"
                width="15%"
                render={(text) => {
                  return (
                    <div>
                      <span style={{ width: 50 }}>{text}</span>&nbsp;%
                    </div>
                  );
                }}
              />
              <Column
                align="left"
                title="经营资质"
                dataIndex="qualificationPics"
                key="qualificationPics"
                width="50%"
                render={(text) => {
                  let images = text ? text.split(',') : [];
                  return images.length > 0 ? (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约品牌</H2>
            <GreyText>已签约{brandList ? brandList.length : 0}个品牌</GreyText>
          </div>
          <TableBox>
            <DataGrid
              rowKey="contractBrandId"
              dataSource={brandList}
              scroll={{ y: 240 }}
              pagination={false}
            >
              <Column
                title="品牌名称"
                dataIndex="brandName"
                key="brandName"
                width="15%"
              />
              <Column
                title="品牌别名"
                dataIndex="nickName"
                key="nickName"
                width="20%"
                render={(text) => {
                  return text ? <span>{text}</span> : <span>-</span>;
                }}
              />
              <Column
                title="品牌logo"
                dataIndex="logo"
                key="log"
                width="15%"
                render={(text, _record: any, i) => {
                  return text ? (
                    <PicBox>
                      <img
                        src={text}
                        key={i}
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: text })
                        }
                      />
                    </PicBox>
                  ) : (
                    <span>-</span>
                  );
                }}
              />
              <Column
                title="授权文件"
                dataIndex="authorizePic"
                key="authorizePic"
                width="50%"
                render={(text) => {
                  let images = text ? text : [];
                  return (
                    <PicBox>
                      {images.map((v, k) => {
                        return (
                          <img
                            src={v.url}
                            key={k}
                            alt=""
                            onClick={() =>
                              this.setState({ showImg: true, imgUrl: v.url })
                            }
                          />
                        );
                      })}
                    </PicBox>
                  );
                }}
              />
            </DataGrid>

            {/*<DataGrid dataSource={ checkBrand } rowKey="contractBrandId" scroll={{y: 240}} pagination={false}>
              <Column
                title="商家自增"
                dataIndex="name"
                key="name"
                width="15%"
              />
              <Column
                dataIndex="nickName"
                key="nickName"
                width="20%"
              />
              <Column
                dataIndex="logo"
                key="logo"
                width="15%"
                render={(text, record: any, i) => {
                  return (
                    <PicBox>
                      <img src={text} key={i} alt="" onClick={() => this.setState({showImg: true, imgUrl:text})}/>
                    </PicBox>
                  )
                }}
              />
              <Column
                dataIndex="authorizePic"
                key="authorizePic"
                width="50%"
                render={(text, record, i) => {
                  let images = text ? text : []
                  return (
                    <PicBox>
                      {
                        images.map((v, k) => {
                          return (
                            <img src={v.url} key={k} alt="" onClick={() => this.setState({showImg: true, imgUrl: v.url})}/>
                          )
                        })
                      }
                    </PicBox>
                  )
                }}
              />
            </DataGrid>*/}
          </TableBox>
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>签约有效期</H2>
            <GreyText>商家店铺有效期</GreyText>
          </div>
          <RangePicker
            value={[
              moment(storeInfo.get('contractStartDate')),
              moment(storeInfo.get('contractEndDate'))
            ]}
            format="YYYY-MM-DD HH:mm:ss"
            disabled
          />
        </Content>

        <Content>
          <div style={{ marginBottom: 10 }}>
            <Red>*</Red>
            <H2>商家类型</H2>
          </div>
          <RadioGroup value={storeInfo.get('companyType')}>
            {storeInfo.get('companyType') == 0 ? (
              <Radio value={0} disabled>
                自营商家
              </Radio>
            ) : storeInfo.get('companyType') == 1 ? (
              <Radio value={1} disabled>
                第三方商家
              </Radio>
            ) : (
              <Radio value={2} disabled>
                统仓统配
              </Radio>
            )}
          </RadioGroup>
          <div style={{ marginTop: 25 }}>
            <Form>
              <FormItem required={true} {...formItemLayout} label="商家ID">
                <Input
                  allowClear
                  value={storeInfo.get('supplierCode')}
                  disabled={true}
                />
              </FormItem>
              {companyType != 1 && (
                <FormItem {...formItemLayout} label="选择仓库" required={true}>
                  <Select
                    mode={'multiple'}
                    allowClear
                    value={
                      chooseWareHouseIds && chooseWareHouseIds.length > 0
                        ? chooseWareHouseIds
                        : []
                    }
                    placeholder="请选择仓库"
                    disabled={true}
                  >
                    {children}
                  </Select>
                </FormItem>
              )}
            </Form>
          </div>
        </Content>

        <Modal
          maskClosable={false}
          visible={this.state.showImg}
          footer={null}
          onCancel={() => this._hideImgModal()}
        >
          <div>
            <div>
              <img
                style={{ width: '100%', height: '100%' }}
                src={this.state.imgUrl}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };
}
