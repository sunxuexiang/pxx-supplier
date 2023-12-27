import React from 'react';
import { Relax } from 'plume2';
import { Tree } from 'antd';
import { List, fromJS } from 'immutable';

import { noop } from 'qmkit';

const TreeNode = Tree.TreeNode;
@Relax
export default class AuthorityManager extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      allMenus: List<any>;
      bossMenus: List<any>;
      menuIdList: List<any>;
      functionIdList: List<any>;
      onCheckMenuAuth: Function;
    };
  };

  static relaxProps = {
    allMenus: 'allMenus',
    bossMenus: 'bossMenus',
    menuIdList: 'menuIdList',
    functionIdList: 'functionIdList',
    onCheckMenuAuth: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { bossMenus, menuIdList, functionIdList } = this.props.relaxProps;
    if (!bossMenus || bossMenus.size <= 0) {
      return null;
    }
    const checkedKeys = {
      checked: menuIdList
        .map((menuId) => `menu_${menuId}`)
        .concat(functionIdList.map((authId) => `func_${authId}`))
        .toJS(),
      halfChecked: []
    };

    return (
      <div className="cardGery">
        <br />
        <h3 style={{ paddingBottom: 10, fontSize: 18, color: '#333' }}>
          角色权限管理
        </h3>
        <Tree
          checkable={true}
          checkStrictly={true}
          onCheck={this._onCheck}
          checkedKeys={checkedKeys}
          defaultExpandAll={true}
        >
          {this._loopMenu(bossMenus)}
        </Tree>
      </div>
    );
  }

  /**
   * 递归获取菜单权限信息
   * @param bossMenus
   * @private
   */
  _loopMenu = (bossMenus) =>
    bossMenus.map((item) => {
      if (item.get('children') && item.get('children').size > 0) {
        return (
          <TreeNode
            key={item.get('id')}
            value={item.get('id')}
            pid={item.get('pid')}
            title={item.get('title')}
          >
            {this._loopMenu(item.get('children'))}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.get('id')}
          value={item.get('id')}
          pid={item.get('pid')}
          title={item.get('title')}
        />
      );
    });

  /**
   * 选中事件
   */
  _onCheck = (_checkedKeys, e) => {
    let {
      allMenus,
      menuIdList,
      functionIdList,
      onCheckMenuAuth
    } = this.props.relaxProps;
    const { checked, node } = e;
    const currKey = node.props.value; // 当前操作的key
    const pareKey = node.props.pid; // 当前操作的父级key

    let idList = fromJS([currKey]); //所有需要被操作到的节点id(勾选或取消勾选的所有节点)

    /*
     * 根据当前菜单id 递归找出子节点id 并加入操作的节点中
     */
    const _getAllCidList = (menuId) => {
      const childMenus = allMenus.filter((menu) => menu.get('pid') == menuId);
      if (childMenus && childMenus.size > 0) {
        childMenus.forEach((cMenu) => {
          idList = idList.push(cMenu.get('id'));
          _getAllCidList(cMenu.get('id'));
        });
      }
    };

    if (checked) {
      /*
       * 1.勾选 某个节点
       * 2.勾选 其所有子节点(递归)
       * 3.勾选 其所有父节点(递归)
       */
      _getAllCidList(currKey); //步骤1,步骤2

      /* 根据当前菜单pid 递归找出父节点id 并加入操作的节点中*/
      const _getAllPidList = (pareMenuId) => {
        if (pareMenuId != 'menu_0') {
          idList = idList.push(pareMenuId);
          const pareMenu = allMenus.find(
            (menu) => menu.get('id') == pareMenuId
          );
          if (pareMenu && pareMenu.get('pid')) {
            _getAllPidList(pareMenu.get('pid'));
          }
        }
      };
      _getAllPidList(pareKey); //步骤3

      const menuIds = idList
        .filter((checkedKey) => checkedKey.indexOf('menu_') > -1)
        .map((checkedKey) => checkedKey.substring(5));
      const funcIds = idList
        .filter((checkedKey) => checkedKey.indexOf('func_') > -1)
        .map((checkedKey) => checkedKey.substring(5));
      menuIds.forEach((menuId) => {
        if (!menuIdList.includes(menuId)) {
          menuIdList = menuIdList.push(menuId);
        }
      });
      funcIds.forEach((funcId) => {
        if (!functionIdList.includes(funcId)) {
          functionIdList = functionIdList.push(funcId);
        }
      });
      onCheckMenuAuth(menuIdList, functionIdList);
    } else {
      /*
       * 1.取消勾选 某个节点
       * 2.取消勾选 其所有子节点(递归)
       * 3.取消勾选 其所有父节点(递归)(若当前节点所有兄弟节点也是取消勾选状态)
       */
      _getAllCidList(currKey); //步骤1,步骤2

      /* 根据当前菜单pid 递归找出父节点id 并加入操作的节点中*/
      const _getAllPidList = (menuId, pareMenuId) => {
        if (pareMenuId != 'menu_0') {
          //找到兄弟节点
          const siblingMenus = allMenus.filter(
            (menu) => menu.get('pid') == pareMenuId && menu.get('id') != menuId
          ) as List<any>;
          if (siblingMenus && siblingMenus.size > 0) {
            let anyChecked;
            if (
              siblingMenus
                .first()
                .get('id')
                .indexOf('menu_') > -1
            ) {
              //菜单
              anyChecked = siblingMenus.some((menu) =>
                menuIdList.includes(menu.get('id').substring(5))
              );
            } else {
              //权限
              anyChecked = siblingMenus.some((menu) =>
                functionIdList.includes(menu.get('id').substring(5))
              );
            }
            if (!anyChecked) {
              // 若没有任意兄弟节点处于勾选状态,即都已经取消勾选了,则取消勾选父级
              idList = idList.push(pareMenuId);
              const pareMenu = allMenus.find(
                (menu) => menu.get('id') == pareMenuId
              );
              if (pareMenu && pareMenu.get('pid')) {
                _getAllPidList(pareMenuId, pareMenu.get('pid'));
              }
            }
          } else {
            // 若当前没有其他兄弟节点
            idList = idList.push(pareMenuId);
            const pareMenu = allMenus.find(
              (menu) => menu.get('id') == pareMenuId
            );
            if (pareMenu && pareMenu.get('pid')) {
              _getAllPidList(pareMenuId, pareMenu.get('pid'));
            }
          }
        }
      };
      _getAllPidList(currKey, pareKey); //步骤3

      const menuIds = idList
        .filter((checkedKey) => checkedKey.indexOf('menu_') > -1)
        .map((checkedKey) => checkedKey.substring(5));
      const funcIds = idList
        .filter((checkedKey) => checkedKey.indexOf('func_') > -1)
        .map((checkedKey) => checkedKey.substring(5));
      menuIds.forEach((menuId) => {
        const _index = menuIdList.findIndex((mId) => mId == menuId);
        if (_index > -1) {
          menuIdList = menuIdList.delete(_index);
        }
      });
      funcIds.forEach((funcId) => {
        const _index = functionIdList.findIndex((fId) => fId == funcId);
        if (_index > -1) {
          functionIdList = functionIdList.delete(_index);
        }
      });
      onCheckMenuAuth(menuIdList, functionIdList);
    }
  };
}
