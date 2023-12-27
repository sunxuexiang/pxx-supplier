import React, { FC, useState, useRef, useEffect } from 'react';
import { Table, Button, Modal, message, Popconfirm, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import CreatMessage from './components/creatMessage';
import { pushMessageAdd, pushMessageList, pushMessageDelete } from './webapi';

const { Column } = Table;

const MessageRelease: FC<any> = () => {
  const [visible, setVisible] = useState(false as boolean);
  const editRef = useRef(null);
  const [tableData, setTableData] = useState([] as any);
  const [page, setPage] = useState({ pageNum: 1, pageSize: 10 } as any);
  const [total, setTotal] = useState(0);
  const [detailVisble, setDetailVisble] = useState(false as boolean);
  const [detailObj, setDetailObj] = useState({} as any);

  useEffect(() => {
    query();
  }, [page]);

  const query = () => {
    pushMessageList({ ...page, pageNum: page.pageNum - 1 }).then(
      ({ res }: any) => {
        if (res.code === Const.SUCCESS_CODE) {
          setTableData(res.context.pushMessagePage.content);
          setTotal(res.context.pushMessagePage.total);
        } else {
          message.error(res.message);
        }
      }
    );
  };

  /**
     * key?: React.Key;
    dataIndex?: string;
    render?: (text: any, record: T, index: number) => React.ReactNode;
     */

  return (
    <div>
      <BreadCrumb />
      <div className="container">
        <Headline title="消息发布" />
        <div
          style={{ height: '45px', display: 'flex', justifyItems: 'center' }}
        >
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            发布消息
          </Button>
        </div>
        <Table
          dataSource={tableData}
          pagination={{
            current: page.pageNum,
            total: total,
            onChange: (page, size) => {
              setPage({ pageNum: page, pageSize: size });
            }
          }}
        >
          <Column title="发布时间" dataIndex="sendTime" />
          <Column title="消息名称" dataIndex="name" />
          <Column title="消息标题" dataIndex="title" />
          <Column title="消息内容" dataIndex="content" />
          <Column title="发布人账号" dataIndex="createAccount" />
          <Column
            title="操作"
            render={(record) => {
              return (
                <div>
                  <Button
                    type="link"
                    onClick={() => {
                      setDetailObj(record);
                      setDetailVisble(true);
                    }}
                  >
                    详情
                  </Button>
                  <Popconfirm
                    title="是否删除该消息"
                    onConfirm={() => {
                      pushMessageDelete(record.messageId).then(
                        ({ res }: any) => {
                          if (res.code === Const.SUCCESS_CODE) {
                            message.success('删除成功');
                            setPage({ pageNum: 1, pageSize: 10 });
                          } else {
                            message.error(res.message);
                          }
                        }
                      );
                    }}
                  >
                    <Button type="link">删除</Button>
                  </Popconfirm>
                </div>
              );
            }}
          />
        </Table>
      </div>
      <Modal
        title="消息发布"
        visible={visible}
        destroyOnClose
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          editRef.current.validateFields((err, value) => {
            if (!err) {
              pushMessageAdd(value).then(({ res }: any) => {
                if (res.code === Const.SUCCESS_CODE) {
                  message.success('保存成功');
                  setVisible(false);
                  setPage({ pageNum: 1, pageSize: 10 });
                } else {
                  message.error(res.message);
                }
              });
            }
          });
        }}
      >
        <CreatMessage ref={editRef} />
      </Modal>
      <Modal
        title="详情"
        onCancel={() => {
          setDetailObj({});
          setDetailVisble(false);
        }}
        footer={null}
        visible={detailVisble}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="名称">{detailObj?.name}</Form.Item>
          <Form.Item label="标题">{detailObj?.title}</Form.Item>
          <Form.Item label="内容">{detailObj?.content}</Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MessageRelease;
