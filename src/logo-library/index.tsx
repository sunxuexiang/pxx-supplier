import React, { useEffect, useState } from 'react';
import './logo-library.less';
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Tree,
  Card,
  Checkbox,
  Pagination,
  Icon
} from 'antd';
import { Const, BreadCrumb } from 'qmkit';
import { getLogoCates, getLogoList, editLogo, delLogoData } from './webapi';
import LogoUpload from './component/logo-upload';

const LogoLibrary = () => {
  const [cateList, setCateList] = useState([] as any);
  // 当前类目搜索参数
  const [cateParams, setCateParams] = useState({
    pageNum: 0,
    pageSize: 10,
    resourceName: '',
    cateIds: [],
    resourceType: 3
  });
  // 总数
  const [logoCount, setLogoCount] = useState(0);
  // 上传弹窗显示
  const [visible, setVisible] = useState(false);
  // logo数据
  const [logoData, setLogoData] = useState([]);
  // 搜索名称
  const [searchName, changeSearchName] = useState('');
  useEffect(() => {
    logoCateList();
  }, []);
  useEffect(() => {
    getLogoData();
  }, [cateParams]);
  // 获取图片类目
  const logoCateList = () => {
    getLogoCates().then((res) => {
      // 改变数据形态，变为层级结构
      const allCate = res.res;
      const newDataList = allCate
        .filter((item) => item.cateParentId === 0)
        .map((data) => {
          const children = allCate
            .filter((item) => item.cateParentId === data.cateId)
            .map((childrenData) => {
              const lastChildren = allCate.filter(
                (item) => item.cateParentId === childrenData.cateId
              );
              if (lastChildren.length > 0) {
                childrenData['children'] = lastChildren;
              }
              return childrenData;
            });

          if (children.length > 0) {
            data['children'] = children;
          }
          return data;
        });
      setCateList(newDataList);
      setCateParams({ ...cateParams, cateIds: [res.res[0].cateId] });
    });
  };
  // 获取当前类目logo
  const getLogoData = () => {
    getLogoList(cateParams)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('获取logo列表失败');
          return;
        }
        const list = data.res.context.content.map((item) => {
          item['isCheck'] = false;
          return item;
        });
        setLogoData([...list]);
        setLogoCount(data.res.context.totalElements);
      })
      .catch((err) => {
        message.error('获取logo列表失败');
      });
  };
  // 处理目录树形数据
  const loop = (cateList) =>
    cateList.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            key={item.cateId}
            value={item.cateId}
            title={item.cateName}
          >
            {loop(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          key={item.cateId}
          value={item.cateId}
          title={item.cateName}
        />
      );
    });
  // 修改名称
  const editInfo = (e, data) => {
    console.warn(e, data);
    const { resourceId, resourceName } = data;
    const params = {
      resourceId,
      resourceName
    };
    editLogo(params)
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('修改失败');
          return;
        }
        message.success('修改成功');
        getLogoData();
      })
      .catch((err) => {
        message.error('修改失败');
      });
  };
  // 搜索
  const searchLogo = () => {
    setCateParams({ ...cateParams, resourceName: searchName });
  };
  // 选择logo
  const checkLogo = (data) => {
    const allData = logoData;
    const idx = logoData.findIndex((item) => {
      return item.resourceId === data.resourceId;
    });
    if (data.isCheck) {
      allData[idx].isCheck = false;
    } else {
      allData[idx].isCheck = true;
    }
    setLogoData([...allData]);
  };
  // 删除
  const delLogo = () => {
    const delIds = [];
    logoData.forEach((item) => {
      if (item.isCheck) {
        delIds.push(item.resourceId);
      }
    });
    console.warn(delIds);

    delLogoData({ resourceIds: delIds })
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          message.error('删除失败');
          return;
        }
        message.success('删除成功');
        getLogoData();
      })
      .catch((err) => {
        message.error('删除失败');
      });
  };
  // 切换目录
  const changeCate = (id) => {
    console.warn(id);
    setCateParams({ ...cateParams, cateIds: id });
  };
  return (
    <div>
      <BreadCrumb />
      <div className="logo-library-container">
        <p className="logo-library-header">logo库</p>
        <Row gutter={20}>
          <Col span={4}>
            <div className="logo-cate-header">logo目录</div>
            <Tree
              // defaultSelectedKeys={imgCateParams.cateIds}
              onSelect={changeCate}
            >
              {loop(cateList)}
            </Tree>
          </Col>
          <Col span={20}>
            <div className="logo-library-operate">
              <div className="operate-input mr-r">
                <Input
                  placeholder="请输入图片名称"
                  value={searchName}
                  onChange={(e) => {
                    changeSearchName(e.target.value);
                  }}
                />
              </div>
              <Button className="mr-r" type="primary" onClick={searchLogo}>
                搜索
              </Button>
              <Button
                className="mr-r"
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                上传logo
              </Button>
              <Button
                type="primary"
                disabled={
                  logoData.filter((item) => {
                    return item.isCheck;
                  }).length === 0
                }
                onClick={() => {
                  delLogo();
                }}
              >
                批量删除
              </Button>
            </div>
            {logoData.length > 0 && (
              <div className="logo-library-list">
                {logoData.map((item, index) => {
                  return (
                    <div
                      className="logo-library-item"
                      key={item.resourceId}
                      onClick={() => {
                        checkLogo(item);
                      }}
                    >
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={item.resourceKey}
                            src={item.artworkUrl}
                            style={{ height: 100 }}
                          />
                        }
                        bodyStyle={{ padding: 10 }}
                        style={{ borderRadius: 10 }}
                      >
                        <Card.Meta
                          description={
                            <Input
                              value={item.resourceName}
                              onChange={(e) => {
                                const val = e.target.value;
                                logoData[index].resourceName = val;
                                setLogoData([...logoData]);
                              }}
                              onBlur={(e) => {
                                editInfo(e, item);
                              }}
                            />
                          }
                        ></Card.Meta>
                      </Card>
                      <Checkbox
                        className="logo-img-check"
                        checked={item.isCheck}
                        onChange={() => {
                          checkLogo(item);
                        }}
                      />
                    </div>
                  );
                })}
                <div className="logo-page">
                  <Pagination
                    onChange={(pageNum) => {
                      const cur = pageNum - 1;
                      setCateParams({ ...cateParams, pageNum: cur });
                    }}
                    current={cateParams.pageNum + 1}
                    total={logoCount}
                    pageSize={cateParams.pageSize}
                  />
                </div>
              </div>
            )}
            {!logoData.length && (
              <div className="no-logo-data">
                <div className="no-logo-data-box">
                  <Icon type="coffee" />
                  <p>暂无数据</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <LogoUpload
        allCate={cateList}
        visible={visible}
        hide={() => {
          setVisible(false);
        }}
        compeletHide={() => {
          setVisible(false);
          getLogoData();
        }}
      />
    </div>
  );
};
export default LogoLibrary;
