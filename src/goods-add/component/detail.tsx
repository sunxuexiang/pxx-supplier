import * as React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, UEditor } from 'qmkit';
import { List } from 'immutable';

@Relax
export default class Detail extends React.Component<any, any> {
  child: any;

  props: {
    relaxProps?: {
      goods: IMap;
      goodsTabs: IList;
      chooseImgs: List<any>;
      imgType: number;

      editGoods: Function;
      refDetailEditor: Function;
      reftabDetailEditor: Function;
      modalVisible: Function;
      editEditor: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    chooseImgs: 'chooseImgs',
    imgType: 'imgType',
    goodsTabs: 'goodsTabs',
    // 修改商品基本信息
    editGoods: noop,
    refDetailEditor: noop,
    reftabDetailEditor: noop,
    modalVisible: noop,
    editEditor: noop
  };

  render() {
    const {
      goods,
      refDetailEditor,
      reftabDetailEditor,
      chooseImgs,
      imgType,
      goodsTabs
    } = this.props.relaxProps;
    return (
      <div>
        <Tabs defaultActiveKey="main" onChange={() => {}}>
          <Tabs.TabPane tab="商品详情" key="main">
            <UEditor
              ref={(UEditor) => {
                refDetailEditor((UEditor && UEditor.editor) || {});
                this.child = UEditor;
              }}
              id="main"
              height="320"
              content={goods.get('goodsDetail')}
              insertImg={() => {
                this._handleClick();
                this.props.relaxProps.editEditor('detail');
              }}
              chooseImgs={chooseImgs.toJS()}
              imgType={imgType}
            />
          </Tabs.TabPane>
          {goodsTabs &&
            goodsTabs.map((val, index) => {
              return (
                <Tabs.TabPane tab={val.tabName} key={index}>
                  <UEditor
                    ref={(UEditor) => {
                      reftabDetailEditor(
                        (UEditor &&
                          UEditor.editor && {
                            tabId: val.tabId,
                            tab: 'detailEditor_' + index,
                            val: UEditor.editor
                          }) ||
                          {}
                      );
                      this.child = UEditor;
                    }}
                    id={'main' + index}
                    height="320"
                    content={val.tabDetail}
                    insertImg={() => {
                      this._handleClick();
                      this.props.relaxProps.editEditor('detailEditor_' + index);
                    }}
                    chooseImgs={chooseImgs.toJS()}
                    imgType={imgType}
                  />
                </Tabs.TabPane>
              );
            })}
        </Tabs>
      </div>
    );
  }

  /**
   * 调用图片库弹框
   * @private
   */
  _handleClick = () => {
    this.props.relaxProps.modalVisible(10, 2);
  };
}
