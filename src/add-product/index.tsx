import React, { useState, createRef, useRef, useEffect } from 'react';
import './add-product.less';
import BaseInfo from './components/base-info';
import ProductAttribute from './components/product-attribute';
import RegionQuota from './components/region-quota';
import LogisticsInfo from './components/logistics-info';
import ProductDetail from './components/product-detail';
import { Button, message, Spin, Icon } from 'antd';
import { addNewProduct, getGoodsDetail, saveProductInfo } from './webapi';
import moment from 'moment';
import { Const, BreadCrumb } from 'qmkit';

export default function AddProduct(props) {
  const baseInfoRef = useRef(null);
  const productAttributeRef = useRef(null);
  const productAttributeAddRef = useRef(null);
  const regionQuotaRef = useRef(null);
  const logisticsInfoRef = useRef(null);
  const productDetailRef = useRef(null);

  const [saveLoading, changeSaveLoading] = useState(false);
  const [goodsDetail, setDetail] = useState({} as any);
  const [openEdit, setEdit] = useState(false);
  const [getDetailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (props.location.state && props.location.state.goodsId) {
      setEdit(true);
      getDetailData(props.location.state.goodsId);
    }
    console.warn(props);
  }, []);
  // 返回
  const back = () => {
    history.back();
  };
  // 新增保存
  const addData = async () => {
    const baseInfoData = await baseInfoRef.current.baseInfoSubmit();
    const attrData = await productAttributeRef.current.attrFormSubmit();
    const regionQuotaData = await regionQuotaRef.current.regionQuotaSubmit();
    const logisticsInfoData = await logisticsInfoRef.current.logisticsInfoSubmit();
    const deatailSubmitData = await productDetailRef.current.deatailSubmit();
    if (
      baseInfoData &&
      attrData &&
      regionQuotaData &&
      logisticsInfoData &&
      deatailSubmitData
    ) {
      // 字段处理
      const goodsInfo = attrData.goodsInfos.map((item) => {
        return {
          ...item,
          ...regionQuotaData,
          shelflife: baseInfoData.shelflife,
          goodsInfoBatchNo: baseInfoData.goodDate
            ? moment(baseInfoData.goodDate).format('YYYY-MM-DD')
            : '',
          isScatteredQuantitative: baseInfoData.isScatteredQuantitative
        };
      });
      const data = {
        goods: {
          ...baseInfoData,
          ...logisticsInfoData,
          ...regionQuotaData,
          ...deatailSubmitData,
          // moreSpecFlag: '1',
          auditStatus: '1',
          saleType: '0',
          goodsType: '0',
          goodsSource: '1',
          allowPriceSet: '1',
          lockStock: '0',
          // isScatteredQuantitative: '0',
          supplyPrice: '0',
          allowPiceSet: '1',
          SubmitTime: moment().format('YYYY-MM-DD HH:mm:ss')
        },
        images: baseInfoData.images,
        goodsInfos: goodsInfo
      };
      console.warn(data, '新增参数');
      changeSaveLoading(true);
      addNewProduct(data)
        .then((res) => {
          if (res.res.code === Const.SUCCESS_CODE) {
            console.warn(res, '新增成功');
            changeSaveLoading(false);
            back();
          } else {
            message.error('新增失败');
            changeSaveLoading(false);
          }
        })
        .catch((err) => {
          console.warn(err, '新增失败');
          message.error('新增失败');
          changeSaveLoading(false);
        });
    }
  };
  // 获取商品详情
  const getDetailData = (id) => {
    setDetailLoading(true);
    getGoodsDetail(id)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取商品详情失败');
          return;
        }
        setDetailLoading(false);
        console.warn(data.res.context, '商品详情');
        setDetail(data.res.context);
      })
      .catch((err) => {
        setDetailLoading(false);
        message.error('获取商品详情失败');
      });
  };
  // 编辑保存
  const saveData = async () => {
    const baseInfoData = await baseInfoRef.current.baseInfoSubmit();
    const attrData = await productAttributeRef.current.attrFormSubmit();
    const addData = await productAttributeAddRef.current.attrFormSubmit();
    const regionQuotaData = await regionQuotaRef.current.regionQuotaSubmit();
    const logisticsInfoData = await logisticsInfoRef.current.logisticsInfoSubmit();
    const deatailSubmitData = await productDetailRef.current.deatailSubmit();
    if (
      baseInfoData &&
      attrData &&
      addData &&
      regionQuotaData &&
      logisticsInfoData &&
      deatailSubmitData
    ) {
      // 字段处理
      let hasMainSKU = false;
      const goodsInfo = attrData.goodsInfos.map((item) => {
        if (item.hostSku === 1) {
          hasMainSKU = true;
        }
        return {
          ...item,
          ...regionQuotaData,
          shelflife: baseInfoData.shelflife,
          goodsInfoBatchNo: baseInfoData.goodDate
            ? moment(baseInfoData.goodDate).format('YYYY-MM-DD')
            : '',
          isScatteredQuantitative: baseInfoData.isScatteredQuantitative
        };
      });
      const addGoodsInfos =
        addData.goodsInfos.map((item) => {
          if (item.hostSku === 1) {
            hasMainSKU = true;
          }
          return {
            ...item,
            ...regionQuotaData,
            shelflife: baseInfoData.shelflife,
            goodsInfoBatchNo: baseInfoData.goodDate
              ? moment(baseInfoData.goodDate).format('YYYY-MM-DD')
              : '',
            isScatteredQuantitative: baseInfoData.isScatteredQuantitative
          };
        }) || [];
      if (!hasMainSKU) {
        message.error('未设置主SKU');
        return false;
      }
      const data = {
        goods: {
          ...baseInfoData,
          ...logisticsInfoData,
          ...regionQuotaData,
          ...deatailSubmitData,
          // moreSpecFlag: '1',
          goodsId: goodsDetail.goods.goodsId,
          auditStatus: '1',
          saleType: '0',
          goodsType: '0',
          goodsSource: '1',
          allowPriceSet: '1',
          lockStock: '0',
          // isScatteredQuantitative: '0',
          supplyPrice: '0',
          allowPiceSet: '1',
          SubmitTime: moment().format('YYYY-MM-DD HH:mm:ss')
        },
        images: baseInfoData.images,
        goodsInfos: goodsInfo,
        addGoodsInfos
      };
      changeSaveLoading(true);
      saveProductInfo(data)
        .then((data) => {
          changeSaveLoading(false);
          if (data.res.code === Const.SUCCESS_CODE) {
            console.warn(data, '修改成功');
            message.success('修改成功');
            back();
          } else {
            message.error('修改失败');
          }
        })
        .catch((err) => {
          console.warn(err, '修改失败');
          message.error('修改失败');
          changeSaveLoading(false);
        });
    }
  };
  return (
    <div>
      <BreadCrumb />
      <div className="new-product-container">
        {saveLoading && (
          <div className="new-product-loading">
            <div className="loading-box">
              <Spin tip="正在保存商品信息..."></Spin>
            </div>
          </div>
        )}
        {openEdit && getDetailLoading && (
          <div className="new-product-loading">
            <div className="loading-box">
              <Spin tip="正在查询商品信息..."></Spin>
            </div>
          </div>
        )}
        {/* 基本信息 */}
        <BaseInfo
          wrappedComponentRef={baseInfoRef}
          openEdit={openEdit}
          goodsDetail={goodsDetail}
        />
        {/* 商品属性 */}
        <ProductAttribute
          wrappedComponentRef={productAttributeRef}
          openEdit={openEdit}
          goodsDetail={goodsDetail}
          productAttributeAddRef={productAttributeAddRef}
        />
        {/* 商品属性 编辑时新增 */}
        {openEdit && (
          <ProductAttribute
            wrappedComponentRef={productAttributeAddRef}
            editAdd
            goodsDetail={goodsDetail}
            productAttributeRef={productAttributeRef}
          />
        )}

        {/* 区域限购 */}
        <RegionQuota
          wrappedComponentRef={regionQuotaRef}
          openEdit={openEdit}
          goodsDetail={goodsDetail}
        />
        {/* 物流信息 */}
        <LogisticsInfo
          wrappedComponentRef={logisticsInfoRef}
          openEdit={openEdit}
          goodsDetail={goodsDetail}
        />
        {/* 商品详情 */}
        <ProductDetail
          wrappedComponentRef={productDetailRef}
          openEdit={openEdit}
          goodsDetail={goodsDetail}
        />
        <div className="new-product-btn">
          <Button
            type="primary"
            onClick={() => {
              if (openEdit) {
                saveData();
              } else {
                addData();
              }
            }}
            style={{ marginRight: 20 }}
            loading={saveLoading}
          >
            保存
          </Button>
          <Button onClick={back}>取消</Button>
        </div>
      </div>
    </div>
  );
}
