import { Alert, Button, Col, Modal, Row, Table, Tree, message } from 'antd';
import { Const, Headline } from 'qmkit';
import React, { useState, useEffect } from 'react';

import '../im-setting.less';
import {
  deleteCustomerCommonMessage,
  deleteImReplyMessageTree,
  getCustomerCommonMessageList,
  getImReplyMessageGroupList
} from '../webapi';

/**
 * IM快捷回复设置
 * @param props
 */
export function IMFastReplySetting(props) {
  // 默认选中的节点
  const [treeSelectKeys, setTreeSelectKeys] = useState([]);

  // 左侧树
  const [treeData, setTreeData] = useState([]);

  // 右侧表格
  const [data, setData] = useState([]);

  useEffect(() => {
    updateGroupList();
    getCommonMessageList();
  }, [props.modalVisible, props.modalType]);

  useEffect(() => {
    getCommonMessageList();
  }, [props.selectNodeInfo, treeSelectKeys]);

  const clickGroupOpera = (index) => {
    const trigger = [
      () => {
        props.onModalVisible(true, 0);
      },
      () => {
        if (!props.selectNodeInfo.isSelect) {
          message.error('请选中一个节点进行修改');
          return;
        }
        props.onModalVisible(true, 1);
      },
      () => {
        if (!props.selectNodeInfo.isSelect) {
          message.error('请选中一个节点进行删除');
          return;
        }
        Modal.confirm({
          title: '您确定要删除该节点吗？',
          content: '该操作将删除该节点下的话术，请谨慎操作',
          onOk() {
            return new Promise((resolve, reject) => {
              (async () => {
                try {
                  const { res } = await deleteImReplyMessageTree({
                    groupId: props.selectNodeInfo.groupId
                  });
                  if (res.code === Const.SUCCESS_CODE) {
                    message.success('删除成功');
                  } else {
                    message.error(res.message);
                  }
                } catch (error) {
                  message.error('删除失败');
                } finally {
                  resolve(null);
                  updateGroupList();
                  props.updateSelectNodeInfo({
                    isSelect: false,
                    level: 0,
                    groupId: 0,
                    parentGroupId: 0,
                    name: ''
                  });
                }
              })();
            });
          },
          onCancel() {}
        });
      }
    ];
    const func = trigger[index];
    if (typeof func === 'function') {
      func();
    }
  };

  const operaClick = (item) => {
    const itemData = data[item.index];
    const funcMap = {
      delete: async () => {
        try {
          const { res } = await deleteCustomerCommonMessage({
            msgId: itemData.msgId
          });
          if (res.code === Const.SUCCESS_CODE) {
            message.success('删除成功');
          } else {
            message.error(res.message);
          }
        } catch (error) {
          message.error('删除失败');
        } finally {
          getCommonMessageList();
        }
      },
      modify: async () => {
        props.onModalVisible(true, 3, itemData);
      }
    };
    const func = funcMap[item.flag];
    if (typeof func === 'function') {
      func();
    }
  };

  const treeOnSelect = (selectedKeys, e) => {
    if (selectedKeys.length == 0) {
      return;
    }
    const nodes = e.selectedNodes;
    setTreeSelectKeys(selectedKeys);
    if (nodes.length > 0) {
      const dataRef = nodes[0].props.dataRef;
      console.warn(dataRef);
      const selectData = {
        isSelect: true,
        level: dataRef.groupLevel,
        groupId: dataRef.groupId,
        parentGroupId: dataRef.parentGroupId,
        name: dataRef.groupName
      };
      props.updateSelectNodeInfo(selectData);
    } else {
      props.updateSelectNodeInfo({
        isSelect: false,
        level: 1,
        groupId: 0,
        parentGroupId: 0,
        name: ''
      });
    }
  };

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      // if (item.childGroupList) {
      //   return (
      //     <Tree.TreeNode
      //       title={item.groupName}
      //       key={item.groupId}
      //       dataRef={item}
      //     >
      //       {renderTreeNodes(item.childGroupList)}
      //     </Tree.TreeNode>
      //   );
      // }
      return (
        <Tree.TreeNode
          key={item.groupId}
          title={item.groupName}
          {...item}
          dataRef={item}
        />
      );
    });
  };

  const updateGroupList = async () => {
    try {
      const { res } = await getImReplyMessageGroupList();
      if (res.code === Const.SUCCESS_CODE) {
        setTreeData(res.context);
        if (res.context.length > 0) {
          if (treeSelectKeys.length == 0) {
            setTreeSelectKeys([`${res.context[0].groupId}`]);
            props.updateSelectNodeInfo({
              isSelect: true,
              level: res.context[0].groupLevel,
              groupId: res.context[0].groupId,
              name: res.context[0].groupName
            });
          }
        }
      }
    } catch (error) {}
  };

  const getCommonMessageList = async () => {
    try {
      // props.selectNodeInfo.isSelect && props.selectNodeInfo.level == 2
      if (treeSelectKeys.length > 0) {
        const { res } = await getCustomerCommonMessageList({
          // oneGroupId: props.selectNodeInfo.parentGroupId,
          // secondGroupId: props.selectNodeInfo.groupId
          oneGroupId: treeSelectKeys[0]
        });
        if (res.code === Const.SUCCESS_CODE) {
          const tableRes = res.context;
          const tableData = tableRes.content.map((item, index) => {
            item.opera = [
              { name: '编辑', flag: 'modify', index: index },
              { name: '删除', flag: 'delete', index: index }
            ];
            return item;
          });
          setData(tableData);
        }
      } else {
        setData([]);
      }
    } catch (error) {}
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'msgId',
      key: 'msgId'
    },
    {
      title: '回复内容',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '最后编辑时间',
      dataIndex: 'updateTimeStr',
      key: 'updateTimeStr'
    },
    {
      title: '操作',
      dataIndex: 'opera',
      key: 'opera',
      render: (records) => {
        return records.map((item, index) => {
          const styles = {
            marginLeft: index == 0 ? '0' : '5px'
          };
          return (
            <a
              key={index}
              className="links"
              onClick={() => {
                operaClick(item);
              }}
              {...item}
              style={styles}
            >
              {item.name}
            </a>
          );
        });
      }
    }
  ];

  const clickAddReplyMessage = () => {
    props.onModalVisible(true, 2);
  };

  return (
    <div>
      <Headline children={<h4>快捷回复设置</h4>} />
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Alert
          type="warning"
          showIcon
          message="快捷回复作用于客服人员在与客户会话中预制好的话术一键回复的功能，话术在此处添加，客服端使用！（先增加分类再分类下创建话术）"
        ></Alert>
      </div>

      <Row>
        <Col span={4}>
          <Row>
            <a className="links" onClick={() => clickGroupOpera(0)}>
              添加
            </a>
            <a
              className="links"
              style={{ marginLeft: 5 }}
              onClick={() => clickGroupOpera(1)}
            >
              编辑
            </a>
            <a
              className="links"
              style={{ marginLeft: 5 }}
              onClick={() => clickGroupOpera(2)}
            >
              删除
            </a>
          </Row>
          <Row>
            <Tree onSelect={treeOnSelect} selectedKeys={treeSelectKeys}>
              {renderTreeNodes(treeData)}
            </Tree>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={19}>
          {/* 之前有二级，现在没有了 && props.selectNodeInfo.level == 2 */}
          {props.selectNodeInfo.isSelect && (
            <Row>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  onClick={clickAddReplyMessage}
                  type="primary"
                  style={{ marginBottom: 5, marginRight: 5 }}
                >
                  添加
                </Button>
              </div>
              <Table
                rowKey={'msgId'}
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}
