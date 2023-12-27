import React, { Children } from 'react';
import { Relax } from 'plume2';
import { Tree,TreeSelect } from 'antd';
import { noop } from 'qmkit'
;const { TreeNode } = TreeSelect;

@Relax 
export default class DepartTree extends React.Component<any,any>{

   constructor(props) {
    super(props);
   }

   static relaxProps={
    departTree:'departTree',
    departList:'departList',
    onFormChange:noop,
    defaultExpandedKeys:'defaultExpandedKeys',
    click:'click',
    lastDepartmentIds:noop
   }   
   

   render() {     
     const { departTree,defaultExpandedKeys } = this.props.relaxProps;          
     return(
       <div id="organization">
          <Tree
              defaultExpandedKeys={defaultExpandedKeys}
              style={{}}             
              onSelect={this.onChange}              
              multiple              
              >    
              {this._loop(departTree)}               
          </Tree>        
       </div>
      
     )
   }

   onChange=(value)=>{
    const { onFormChange,click,lastDepartmentIds } = this.props.relaxProps;
    const selectIds = this._findParentAndChildrenIds(value);
    //再去个重
    const departmentIds = Array.from(new Set(selectIds));     
    lastDepartmentIds(departmentIds);
    //全部亮着的话，展示全部
    if(click){
      onFormChange({
        field: 'departmentIds',
        value: []
      });          
    }else{
      onFormChange({
        field: 'departmentIds',
        value: departmentIds
      });  
    }  
   }

   //传入父部门ID集合，返回父+子的all部门ID集合
   _findParentAndChildrenIds=(parentIds)=>{
    const { departList } = this.props.relaxProps;
    //循环value，将其子级的 departmentId 也加进来
    return parentIds.reduce((pre,current)=>{      
      pre.push(current);
      //筛选出目标的子部门
      departList.filter(vo=>vo.get('parentDepartmentIds').split('|').includes(current)).map(target=>{        
        pre.push(target.get('departmentId').toString())
      })
      return pre;
    },[]);    
   }

   _loop=(allDeparts)=>{     
    return allDeparts.map(dep=>{
      //子部门
      if(dep.get('children') && dep.get('children').size >0 ){
        const childDeparts = dep.get('children');
        return (
           <TreeNode                 
               value={dep.get('departmentId')} 
               key={dep.get('departmentId')} 
               title={`${dep.get('departmentName')} (${dep.get('employeeNum')})`}
            >             
              {this._loop(childDeparts)}
           </TreeNode>
        )
      }
      return (
        <TreeNode          
          key={dep.get('departmentId')}
          value={dep.get('departmentId')}        
          title={`${dep.get('departmentName')}  (${dep.get('employeeNum')})`}
        />
      );
    })
   }
}