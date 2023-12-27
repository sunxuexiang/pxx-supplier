import React from 'react';

import { Button,Popconfirm } from 'antd';
import { noop,history } from 'qmkit';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
@Relax
export default class ListButton extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onChange:Function;
      deleteSelectedSku:Function;
    };
  };

  static relaxProps = {
    onChange:noop,
    deleteSelectedSku:noop,
  };

  render() {
    const {onChange,deleteSelectedSku} = this.props.relaxProps;
    
    return (
      <div style={{marginBottom:'10px'}}>
          <Button type="primary" onClick={()=>{
                  onChange('modalVisible',true);
                  onChange('selectedSkuIds',fromJS([]));
                  onChange('selectedRows',fromJS([]));
              }} >  添加商品
          </Button>
          <Popconfirm
              title="确定全部清空商品？"
              onConfirm={() =>  deleteSelectedSku(1)}
              okText="确定"
              cancelText="取消"
            >
              <Button  style={{marginLeft:'10px'}}  >  全部清空
            </Button>
          </Popconfirm>
      </div>
    );
  }




}
