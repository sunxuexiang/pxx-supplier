import React from 'react';
import { Form, TreeSelect, Row, Col, Button } from 'antd';
import { FindArea } from 'qmkit';
import { nextTick } from 'process';

const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class AddressInfo extends React.Component<any, any> {
  props: {
    form: any;
    changeArea: Function;
    changeCityArea: Function;
    save: Function;
    areaAry: any;
    cityAreaAry: any;
  };

  render() {
    const {
      form,
      changeArea,
      save,
      areaAry,
      cityAreaAry,
      changeCityArea
    } = this.props;
    const { getFieldDecorator } = form;
    let cityAreaAryas = cityAreaAry ? cityAreaAry.toJS() : cityAreaAry;
    const tProps = {
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择地区',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      style: {
        minWidth: 300
      }
    };

    return (
      <div>
        <Row
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* <Col
            span={24}
            style={{
              flexDirection: 'row',
              display: 'flex',
              width: '50%',
              alignItems: 'center'
            }}
          >
            <div style={{ width: '100px' }}>设置覆盖区域：</div>
            <FormItem
              style={{ display: 'inline-block', marginBottom: 0, width: '80%' }}
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
          </Col> */}
          <Col
            span={24}
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div style={{ width: '184px' }}>10件起免运费设置覆盖区域：</div>
            <FormItem
              style={{ display: 'inline-block', marginBottom: 0, width: '37%' }}
            >
              {getFieldDecorator('destinationAreaCity', {
                initialValue: cityAreaAry ? cityAreaAry.toJS() : cityAreaAry
              })(
                <TreeSelect
                  {...tProps}
                  treeData={this._buildFreeAreaDataWithTenCases('')}
                  onChange={(value, label) => {
                    const TreeList = FindArea.findProvinceArea([]);
                    // console.info(value, label, 'changetreeselect');
                    let gVO = cityAreaAry ? cityAreaAry.toJS() : cityAreaAry;
                    // console.log(gVO,'gVOgVO');
                    if (value.length > gVO.length) {
                      // var AddressConfigVO =  {
                      let VillagesAddressConfigVO = {
                        provinceName: null, // 省名
                        provinceId: null, // 省名ID
                        cityName: null, // 市名
                        cityId: null, // 市名ID
                        areaName: null, // 区名
                        areaId: null, // 区名ID
                        villageName: null, // 街道
                        villageId: null, // 街道ID
                        detailAddress: null // 省市区中文地址
                      };
                      // }
                      TreeList.forEach((element) => {
                        if (value && value.indexOf(element.value) != -1) {
                        } else if (element.children) {
                          element.children.forEach((child1, index) => {
                            if (value.indexOf(child1.value) != -1) {
                            } else if (child1.children) {
                              child1.children.forEach((child2, index) => {
                                if (value.indexOf(child2.value) != -1) {
                                } else if (child2.children) {
                                  child2.children.forEach((child3, index) => {
                                    if (value.indexOf(child3.value) != -1) {
                                      // 省
                                      VillagesAddressConfigVO.provinceName =
                                        element.label;
                                      VillagesAddressConfigVO.provinceId =
                                        element.value;
                                      // 市
                                      VillagesAddressConfigVO.cityName =
                                        child1.label;
                                      VillagesAddressConfigVO.cityId =
                                        child1.value;
                                      // 区
                                      VillagesAddressConfigVO.areaName =
                                        child2.label;
                                      VillagesAddressConfigVO.areaId =
                                        child2.value;
                                      // 街道
                                      VillagesAddressConfigVO.villageName =
                                        child3.label;
                                      VillagesAddressConfigVO.villageId =
                                        child3.value;
                                      VillagesAddressConfigVO.detailAddress =
                                        element.label +
                                        child1.label +
                                        child2.label +
                                        child3.label;
                                      gVO.push(
                                        JSON.parse(
                                          JSON.stringify(
                                            VillagesAddressConfigVO
                                          )
                                        )
                                      );
                                      // console.log(child3,'elementelementelement3',child3.label,child2.label,child1.label,element.label);
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                      let villageIds = [];
                      let LiatDeilt = [];
                      gVO.forEach((el) => {
                        if (villageIds.indexOf(el.villageId) === -1) {
                          villageIds.push(el.villageId);
                          LiatDeilt.push(el);
                        }
                      });
                      changeCityArea(LiatDeilt);
                    } else {
                      let listGoc = [];
                      gVO.forEach((element) => {
                        if (value.indexOf(element.villageId) != -1) {
                          listGoc.push(element);
                        }
                      });
                      changeCityArea(listGoc);
                    }
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
        </Row>
        <div className="bar-button">
          <Button
            onClick={() => save()}
            type="primary"
            style={{ marginRight: 10, marginLeft: 22 }}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }
  /**
   * 构建包邮地区数据
   */
  _buildFreeAreaData = (id) => {
    return FindArea.findProvinceCity([]);
  };

  _buildFreeAreaDataWithTenCases = (id) => {
    let Caes = JSON.parse(JSON.stringify(FindArea.findProvinceArea([])));
    Caes.forEach((item, index) => {
      item.disabled = true;
      item.children.forEach((element) => {
        element.disabled = true;
        element.children.forEach((el3) => {
          el3.disabled = true;
        });
      });
    });
    return Caes;
  };
}
// const valueMap = {};
// function loops(list, parent) {
//   console.log('====================================');
//   console.log(list, parent,'list, parent');
//   console.log('====================================');
//   return (list || []).map(({ children, value }) => {
//     const node = (valueMap[value] = {
//       parent,
//       value
//     });
//     node.children = loops(children, node);
//     return node;
//   });
// }

// loops(FindArea.findProvinceArea([]),'');

// function getPath(value) {
//   const path = [];
//   let current = valueMap[value];
//   console.log(valueMap,'currentcurrent');

//   while (current) {
//     path.unshift(current.value);
//     current = current.parent;
//   }
//   return path;
// }
