import React from 'react';
import { Relax, IMap } from 'plume2';

import { Button, Modal, message, Radio, Form, Select, Input } from 'antd';
import styled from 'styled-components';
import { noop, DataGrid, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import validate from '../../../web_modules/qmkit/validate';
const FormItem = Form.Item;
const Option = Select.Option;

const { Column } = DataGrid;

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
  padding-bottom: 10px;
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
    form: any;
    relaxProps?: {
      brandModal: Function;
      sortModal: Function;
      checkboxModal: Function;
      setCurrentStep: Function;
      company: IMap;
      contractBrandList: IMap;
      renewAll: Function;
      otherBrands: IList;
      allBrands: any;
      selfWareHouses: IList;
      changeCompanyType: Function;
      setChooseWareHouse: Function;
      setErpId: Function;
      saveCompanyTypeAndWareHouse: Function;
      delMarket: Function;
      delStore: Function;
    };
  };

  static relaxProps = {
    // 品牌弹框
    brandModal: noop,
    // 分类弹框
    sortModal: noop,
    checkboxModal: noop,
    //设置当前页
    setCurrentStep: noop,
    company: 'company',
    contractBrandList: 'contractBrandList',
    renewAll: noop,
    otherBrands: 'otherBrands',
    allBrands: 'allBrands',
    selfWareHouses: 'selfWareHouses',
    changeCompanyType: noop,
    setChooseWareHouse: noop,
    setErpId: noop,
    saveCompanyTypeAndWareHouse: noop,
    delMarket: noop,
    delStore: noop
  };

  componentWillMount() {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  }

  render() {
    const {
      company,
      otherBrands,
      selfWareHouses,
      changeCompanyType,
      setErpId,
      delMarket,
      delStore
    } = this.props.relaxProps;
    const checkBrand = company.get('checkBrand').toJS(); //商家自增的品牌
    const brandList = company.get('brandList').toJS(); //已审核的品牌
    const cateList = company.get('cateList').toJS();
    const marketList = company.get('marketList').toJS();
    const storeList = company.get('storeList').toJS();
    const companyType = company.get('companyType');
    const chooseWareHouseIds = company.get('wareHourseIds'); //已选的分仓
    const totalBrand = brandList.length + otherBrands.toJS().length; //总的签约品牌数量
    const erpId = company.get('info').get('erpId');

    let children = [];
    if (selfWareHouses && selfWareHouses.length > 0) {
      selfWareHouses.map((s) => {
        children.push(
          <Option key={s.get('wareId')} value={s.get('wareId')}>
            {s.get('wareName')}
          </Option>
        );
      });
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="contract-table">
        <Content>
          <div>
            <Red>*</Red>
            <H2>签约批发市场</H2>
            <GreyText>已签约{marketList.length}个类目</GreyText>
            <Button onClick={() => this._showCheckboxModal(0)}>
              编辑签约批发市场
            </Button>
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
                align="center"
                dataIndex="relationName"
                key="relationName"
                width="70%"
              />
              <Column
                title="操作"
                align="left"
                dataIndex="opration"
                key="opration"
                width="30%"
                render={(_, rowInfo) => {
                  return (
                    <Button
                      style={{ paddingLeft: 0 }}
                      type="link"
                      onClick={() => delMarket(rowInfo)}
                    >
                      删除
                    </Button>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约商城分类</H2>
            <GreyText>已签约{storeList.length}个商城分类</GreyText>
            <Button onClick={() => this._showCheckboxModal(1)}>
              编辑签约商城分类
            </Button>
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
                align="center"
                dataIndex="relationName"
                key="relationName"
                width="70%"
              />
              <Column
                title="操作"
                align="left"
                dataIndex="opration"
                key="opration"
                width="30%"
                render={(_, rowInfo) => {
                  return (
                    <Button
                      style={{ paddingLeft: 0 }}
                      type="link"
                      onClick={() => delStore(rowInfo)}
                    >
                      删除
                    </Button>
                  );
                }}
              />
            </DataGrid>
          </TableBox>
        </Content>

        <Content>
          <div>
            <Red>*</Red>
            <H2>签约类目</H2>
            <GreyText>
              已签约{cateList.length}个类目 最多可签约200个类目
            </GreyText>
            <Button onClick={this._showSortsModal}>编辑签约类目</Button>
          </div>
          <TableBox>
            <DataGrid
              dataSource={cateList}
              scroll={{ y: 240 }}
              pagination={false}
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
            <GreyText>已签约{totalBrand}个品牌</GreyText>
            <Button onClick={this._showModal}>编辑签约品牌</Button>
          </div>
          <TableBox>
            <DataGrid
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
            {checkBrand.length == 0 ? null : (
              <DataGrid
                dataSource={checkBrand}
                rowKey="contractBrandId"
                scroll={{ y: 240 }}
                pagination={false}
              >
                <Column
                  title="商家自增"
                  dataIndex="name"
                  key="name"
                  width="15%"
                />
                <Column dataIndex="nickName" key="nickName" width="20%" />
                <Column
                  dataIndex="logo"
                  key="logo"
                  width="15%"
                  render={(text, record: any) => {
                    return text ? (
                      <img
                        src={record.logo}
                        width="140"
                        height="50"
                        alt=""
                        onClick={() =>
                          this.setState({ showImg: true, imgUrl: record.logo })
                        }
                      />
                    ) : (
                      <span>-</span>
                    );
                  }}
                />
                <Column
                  dataIndex="authorizePic"
                  key="authorizePic"
                  width="50%"
                  render={(text) => {
                    let images = text ? text : [];
                    return images.length > 0 ? (
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
                    ) : (
                      <span>-</span>
                    );
                  }}
                />
              </DataGrid>
            )}
          </TableBox>

          {/* <Content>
            <div style={{ marginBottom: 10 }}>
              <Red>*</Red>
              <H2>商家类型</H2>
            </div>
            <RadioGroup
              value={companyType != null ? companyType : 1}
              onChange={(e) => changeCompanyType((e as any).target.value)}
            >
              <Radio value={0} disabled={true}>
                自营商家
              </Radio>
              <Radio value={1}>第三方商家</Radio>
              // <Radio value={2}>统仓统配</Radio>
            </RadioGroup>
            <div style={{ marginTop: 25 }}>
              <Form>
                <FormItem {...formItemLayout} label="商家ID">
                  {getFieldDecorator('erpId', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入商家ID'
                      },
                      {
                        pattern: validate.erpIdLength,
                        message: '请输入正确的商家ID'
                      }
                    ],
                    onChange: (e) => setErpId(e.target.value),
                    initialValue: erpId
                  })(<Input allowClear placeholder="请输入商家ID" />)}
                </FormItem>
                {(companyType != null ? companyType : 1) != 1 && (
                  <FormItem
                    {...formItemLayout}
                    label="选择仓库"
                    required={true}
                  >
                    {getFieldDecorator('wareHouseIds', {
                      onChange: (value) => this._editChooseWarehourse(value),
                      initialValue:
                        chooseWareHouseIds && chooseWareHouseIds.length > 0
                          ? chooseWareHouseIds
                          : []
                    })(
                      <Select
                        mode={'multiple'}
                        allowClear
                        placeholder="请选择仓库"
                      >
                        {children}
                      </Select>
                    )}
                  </FormItem>
                )}
              </Form>
            </div>
          </Content> */}
        </Content>
        <Content>
          <Button onClick={this._prev}>上一步</Button>
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            onClick={this._next}
          >
            下一步
          </Button>
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

  /**
   * 显示品牌弹框
   */
  _showModal = () => {
    const { brandModal } = this.props.relaxProps;
    brandModal();
  };

  /**
   * 显示类目弹框
   */
  _showSortsModal = () => {
    const { sortModal } = this.props.relaxProps;
    sortModal();
  };

  /**
   * 显示批发市场/商城分类弹框
   */
  _showCheckboxModal = (modalType) => {
    const { checkboxModal } = this.props.relaxProps;
    checkboxModal(modalType);
  };

  /**
   * 下一步
   */
  _next = () => {
    // const form = this.props.form;
    // form.validateFields(null, (errs) => {
    //如果校验通过  商家入驻需求修改  无需保存商家类型信息
    // if (!errs) {
    const { allBrands, renewAll, company } = this.props.relaxProps;
    const checkBrand = company.get('checkBrand').toJS();
    let repeatPlatForm;
    let count = 0;
    //判重
    if (checkBrand.length > 0) {
      checkBrand.map((item) => {
        repeatPlatForm = allBrands
          .toJS()
          .filter((v) => v.brandName == item.name);
        if (repeatPlatForm.length > 0) {
          count++;
        }
      });
    }
    if (count == 0) {
      renewAll();
    } else {
      message.error('自定义品牌与平台品牌重复！');
    }
    // } else {
    //   this.setState({});
    // }
    // });
  };

  /**
   * 上一步
   */
  _prev = () => {
    const { setCurrentStep } = this.props.relaxProps;
    setCurrentStep(1);
  };

  //关闭图片弹框
  _hideImgModal = () => {
    this.setState({
      showImg: false,
      imgUrl: ''
    });
  };

  _editChooseWarehourse = (value) => {
    const { setChooseWareHouse } = this.props.relaxProps;
    setChooseWareHouse(value);
  };
}
