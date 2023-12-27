import React from 'react';
import { Modal, TreeSelect, Tree, message } from 'antd';
import { Relax } from 'plume2';
// import FreightForm from './freight-form';
import { noop } from 'qmkit';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { IList } from 'typings/globalType';
const TreeNode = Tree.TreeNode;
@Relax
export default class ClassfyiModal extends React.Component<any, any> {
  _form: any;
  props: {
    history?: any;
    relaxProps?: {
      classfyiVisible: boolean;
      setClassfyiVisible: Function;
      cateId: string;
      setCateId: Function;
      goodsIds: string[];
      setGoodsIds: Function;
      cateModalList: Array<any>;
      submitCatePut: Function;
    };
  };

  static relaxProps = {
    classfyiVisible: 'classfyiVisible',
    setClassfyiVisible: noop,
    goodsIds: 'goodsIds',
    cateId: 'cateId',
    setCateId: noop,
    setGoodsIds: noop,
    cateModalList: 'cateModalList',
    submitCatePut: noop
  };

  render() {
    const { classfyiVisible, cateModalList, setCateId } = this.props.relaxProps;
    console.log('cateModalList----', cateModalList);
    return (
      <div>
        {classfyiVisible ? (
          <Modal
            maskClosable={false}
            title="批量修改分类"
            visible={classfyiVisible}
            onOk={() => this._handleOK()}
            onCancel={() => this._onCancel()}
          >
            {/* <WrapperForm
              ref={form => (this._form = form)}
              {...{ relaxProps: this.props.relaxProps }}
            /> */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '112px'
              }}
            >
              <div>平台分类：</div>
              <TreeSelect
                style={{ width: '230px' }}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(id) => {
                  setCateId(id);
                }}
                placeholder="请选择分类"
                notFoundContent="暂无分类"
                // disabled={cateDisabled}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
              >
                {this.loop(cateModalList)}
              </TreeSelect>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }

  loop = (cateList) => {
    return cateList.map((item) => {
      if (item.get('children') && item.get('children').count()) {
        console.log('-----------------', item.get('children').toJS());
        // 一二级类目不允许选择
        return (
          <TreeNode
            key={item.get('cateId')}
            disabled={true}
            value={item.get('cateId')}
            title={item.get('cateName')}
          >
            {this.loop(item.get('children'))}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.get('cateId')}
          value={item.get('cateId')}
          title={item.get('cateName')}
        />
      );
    });
  };

  //   loop = (cateList) => {
  //     return cateList.map((item) => {
  //       if (item.goodsCateList.length > 0) {
  //         // 一二级类目不允许选择
  //         return (
  //           <TreeNode
  //             key={item.cateId}
  //             disabled={true}
  //             value={item.cateId}
  //             title={item.cateName}
  //           >
  //             {this.loop(item.goodsCateList)}
  //           </TreeNode>
  //         );
  //       }
  //       return (
  //         <TreeNode key={item.cateId} value={item.cateId} title={item.cateName} />
  //       );
  //     });
  //   };

  /**
   * 提交商品关联运费模板数据
   */
  _handleOK = () => {
    const { cateId, submitCatePut } = this.props.relaxProps;
    if (!cateId) {
      return message.error('请选择分类');
    }
    submitCatePut(cateId);
  };
  /**
   * 取消设置并关闭modal
   */
  _onCancel = () => {
    const { setClassfyiVisible } = this.props.relaxProps;
    setClassfyiVisible(false);
  };
}
