import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Dropdown, Menu, Icon, Modal, message, Alert } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { noop, AuthWrapper, checkAuth, ExportModal } from 'qmkit';
import { IMap } from '../../../typings/globalType';
const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      setFeightVisible: Function;
      onExportModalShow: Function;
      exportModalData: IMap;
      onExportModalHide: Function;
      switchShowModal: Function;
      onFieldChange: Function;
      synchronizeSpecialGoods: Function;
      goodsPageContent: IList;
      setClassfyiVisible: Function;
      setGoodsIds: Function;
    };
  };

  static relaxProps = {
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    setFeightVisible: noop,
    onExportModalShow: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData',
    switchShowModal: noop,
    onFieldChange: noop,
    setClassfyiVisible: noop,
    setGoodsIds: noop,

    synchronizeSpecialGoods: noop,
    goodsPageContent: ['goodsPage', 'content']
  };

  render() {
    const {
      exportModalData,
      onExportModalHide,
      synchronizeSpecialGoods
    } = this.props.relaxProps;
    let hasMenu = false;
    if (
      checkAuth('f_goods_up_down-ls') ||
      checkAuth('f_goods_6-ls') ||
      checkAuth('f_goods_temp_set-ls')
    ) {
      hasMenu = true;
    }

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_goods_sku_edit-ls'}>
          <div className="handle-bar">
            {/* {hasMenu && (
              <Dropdown
                overlay={this._menu()}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  批量操作
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )} */}
            <Button type="primary" onClick={this._batchClassfyi.bind(this)}>
              批量修改分类
            </Button>
            {/* <Button type="primary" onClick={this._batchExport.bind(this)}>
              特价商品批量导出
            </Button>
            <Button type="primary" onClick={this._onBatchChecked}>
              批量设价
            </Button>
            <Button
              type="primary"
              onClick={() => {
                synchronizeSpecialGoods();
              }}
            >
              同步特价仓
            </Button> */}
          </div>
        </AuthWrapper>
        {/* <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
          extraDom={
            <Alert
              message="操作说明：为保证效率，每次最多支持导出1000条记录，如需导出更多，请更换筛选条件后再次导出"
              type="warning"
            />
          }
        /> */}
        <ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />
      </div>
    );
  }

  /**
   * 批量设价
   * @private
   */
  _onBatchChecked = () => {
    const {
      selectedSpuKeys,
      onFieldChange,
      switchShowModal,
      goodsPageContent
    } = this.props.relaxProps;
    let checkedGoods = [],
      checkedGoodsId = [];
    if (selectedSpuKeys.count() < 1) {
      message.error('请先选择特价商品');
      return;
    } else {
      checkedGoods = goodsPageContent
        .toJS()
        .filter((goods) => selectedSpuKeys.indexOf(goods.goodsId) > -1);
    }
    let isAllSpecialGoods = checkedGoods.every((item) => item.goodsType == 2);
    if (!isAllSpecialGoods) {
      message.error('选择的商品中含有非特价商品');
      return;
    }
    checkedGoods.map((item) => checkedGoodsId.push(item.goodsInfoIds));
    onFieldChange('goodsInfoIdList', checkedGoodsId.flat(1));
    switchShowModal(true, '批量设价');
  };

  _menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down-ls">
            <a
              href="javascript:;"
              onClick={() => {
                this._spuOnSale();
              }}
            >
              批量上架
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down-ls">
            <a
              href="javascript:;"
              onClick={() => {
                this._spuOffSale();
              }}
            >
              批量下架
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_6-ls">
            <a
              href="javascript:;"
              onClick={() => {
                this._delGoods();
              }}
            >
              批量删除
            </a>
          </AuthWrapper>
        </Menu.Item>
        {/* <Menu.Item>
          <AuthWrapper functionName="f_goods_export">
            <a
              href="javascript:;"
              onClick={() => {
                this._batchExport();
              }}
            >
              批量导出
            </a>
          </AuthWrapper>
        </Menu.Item> */}
        <Menu.Item>
          <AuthWrapper functionName="f_goods_temp_set-ls">
            <a
              href="javascript:;"
              onClick={() => {
                this._setFeight();
              }}
            >
              设置运费模板
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <Link to="/goods-update-import">表格导入修改</Link>
        </Menu.Item>
      </Menu>
    );
  };

  _setFeight = () => {
    const { selectedSpuKeys, setFeightVisible } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    } else {
      setFeightVisible(true);
    }
  };

  _spuOnSale = () => {
    const { spuOnSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要上架这些商品吗？',
      onOk() {
        spuOnSale();
      }
    });
  };

  /**
   * 批量修改分类
   * @returns
   */
  _batchClassfyi = () => {
    const {
      setClassfyiVisible,
      setGoodsIds,
      selectedSpuKeys
    } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
    } else {
      setGoodsIds();
      setClassfyiVisible(true);
    }
  };

  _spuOffSale = () => {
    const { spuOffSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要下架这些商品吗？',
      onOk() {
        spuOffSale();
      }
    });
  };

  _delGoods = () => {
    const { spuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要删除这些商品吗？',
      onOk() {
        spuDelete();
      }
    });
  };
  /**
   * 批量导出
   */
  _batchExport() {
    const { onExportModalShow } = this.props.relaxProps;
    onExportModalShow({
      byParamsTitle: '导出筛选出的信息',
      byIdsTitle: '导出勾选的信息'
    });
  }
}
