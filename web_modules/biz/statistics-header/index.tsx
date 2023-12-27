import React from 'react';
import { Tooltip, Icon, Select } from 'antd';
import { util, noop,SelectGroup } from 'qmkit';
import moment from 'moment';

const Option = Select.Option;

interface HeaderProps {
  //气泡说明文字，可直接传文字，也可自定义渲染
  // title?: string,
  // renderTitle?: Function,
  menuList?: any;
  onClick: Function; //选项卡点击
  todayDisabled?: boolean; // 去除今天选项，用于客户统计页面
  noTitle?: boolean; // 没有统计说明，用于客户统计页面
  warehouseList?:any;//仓库选择框，用于商品统计
  selectWare?:Function;
}

export default class StatisticsHeader extends React.Component<
  HeaderProps,
  any
  > {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      menuList: props.menuList ? props.menuList : [],
      clickKey: 0,
      menuName: '自然月',
      selectDate: '0',
      data: [],
      warehouseList:this.props.warehouseList||[],
      wareId:null
    };
  }

  //初始化menu下拉菜单内容
  componentWillMount() {
    this._renderMenu();
    if (this.props.todayDisabled) {
      this.setState({
        clickKey: -1 //被点击的项目的key值
      });
    } else {
      this.setState({
        clickKey: 0 //被点击的项目的key值
      });
    }
  }

  static defaultProps = {
    onClick: noop
  };

  render() {
    const { clickKey } = this.state;

    return (
      <div style={styles.headerBar}>
        <div style={styles.timeBox}>
          <ul style={styles.box}>
            {!this.props.todayDisabled && (
              <li>
                <a
                  onClick={() => this._change(0)}
                  className={clickKey == 0 ? 'statisticsItemCur'
                    : 'statisticsItem'}
                  href="javascript:;"
                >
                  今天
                </a>
              </li>
            )}
            <li>
              <a
                onClick={() => this._change(-1)}
                className={clickKey == -1 ? 'statisticsItemCur'
                  : 'statisticsItem'}
                href="javascript:;"
              >
                昨天
              </a>
            </li>
            <li>
              <a
                onClick={() => this._change(1)}
                className={clickKey == 1 ? 'statisticsItemCur'
                  : 'statisticsItem'}
                href="javascript:;"
              >
                最近7天
              </a>
            </li>
            <li>
              <a
                onClick={() => this._change(2)}
                className={clickKey == 2 ? 'statisticsItemCur'
                  : 'statisticsItem'}
                href="javascript:;"
              >
                最近30天
              </a>
            </li>
          </ul>
          <Select
            dropdownMatchSelectWidth={false}
            defaultValue="自然月"
            value={clickKey != 3 ? '0' : this.state.selectDate}
            onChange={value => this._selectOnChange(value)}
          >
            <Option key={0}>自然月</Option>
            {this.state.menuList.map(menu => (
              <Option key={menu}>{menu}</Option>
            ))}
          </Select>
          
          {this.props.warehouseList?.length?
          <div style={{marginLeft:'13px',marginBottom:'3.5px'}}>
            <SelectGroup
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="所属仓库"
                defaultValue=""
                showSearch
                style={{}}
                onChange={(value) => {
                  this._selectWarehouseChange(value);
                }}
              >
                <Option key="" value="">全部</Option>
                {this.props.warehouseList.map((v, i) => {
                  return (
                    <Option key={i} value={(v.wareId)+''}>
                      {v.wareName}
                    </Option>
                  );
                })}
              </SelectGroup>
          </div>:null
        }
        </div>

        {!this.props.noTitle && (
          <div style={{ textAlign: 'right' }}>
            <Tooltip placement="left" title={this._renderTitle}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />&nbsp;&nbsp;统计说明
              </a>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  _renderTitle = () => {
    return (
      <div>
        <p>
          <span>1、当前统计不区分PC/H5/APP端；</span>
        </p>
        <p>
          <span>2、当前统计不区分订货端和管理端；</span>
        </p>
        <p>
          <span>
            3、订单在提交成功后纳入统计，订单金额以订单提交成功时为准；
          </span>
        </p>
        <p>
          <span>4、退单在完成后纳入统计，退货金额以退单完成时为准；</span>
        </p>
        <p>
          <span>
            5、统计时间内商品没有销售/退货，客户没有订单/退单，则不在报表中体现；
          </span>
        </p>
      </div>
    );
  };

  _selectWarehouseChange=(value)=>{
    const { selectWare } = this.props;
    this.setState({
      wareId:value
    })
    selectWare(value);
  }

  _selectOnChange = value => {
    if (value === '0') return;
    const { onClick } = this.props;
    const thisMonth = moment(value, 'YYYY年MM月');
    this.setState({ clickKey: 3, selectDate: value });
    const rangeDate = new Array();
    rangeDate.push(
      util.formateDate(thisMonth.startOf('month').toDate()),
      util.formateDate(thisMonth.endOf('month').toDate())
    );
    //拼接
    const yearMonth =
      util.formateDate(thisMonth.startOf('month').toDate()).split('-')[0] +
      '-' +
      util.formateDate(thisMonth.startOf('month').toDate()).split('-')[1];
    rangeDate.push(yearMonth);
    onClick(rangeDate);
  };

  /**
   * 选项卡切换返回指定的日期，用数组来存储范围
   * @param key
   * @returns {any[]}
   * @private
   */
  _change = key => {
    this.setState({
      clickKey: key
    });
    const { onClick } = this.props;
    const rangeDate = new Array();
    //获取昨天的日期
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    //获取7天前的日期
    const sevenago = new Date(new Date().getTime() - 24 * 7 * 60 * 60 * 1000);
    //获取30天前的日期
    const monthago = new Date(new Date().getTime() - 24 * 30 * 60 * 60 * 1000);
    if (key == '-1') {
      //获取昨天的日期,再加一个索引标识，方便兼容各个模块的接口调用入参
      rangeDate.push(
        util.formateDate(yesterday),
        util.formateDate(yesterday),
        1
      );
    } else if (key == '0') {
      //获取当天的日期
      rangeDate.push(
        util.formateDate(new Date()),
        util.formateDate(new Date()),
        0
      );
    } else if (key == '1') {
      //获取七天前的日期范围
      rangeDate.push(
        util.formateDate(sevenago),
        util.formateDate(yesterday),
        2
      );
    } else {
      //最近30天的日期范围
      rangeDate.push(
        util.formateDate(monthago),
        util.formateDate(yesterday),
        3
      );
    }
    //将返回日期的返回通过外部的onClick事件获取
    onClick(rangeDate);
  };

  _renderMenu = () => {
    let date = new Date();
    let menuList = new Array();
    for (let i = 0; i < 6; i++) {
      date.setMonth(date.getMonth() - 1, 1);
      menuList.push(this._formateDate(date));
    }
    this.setState({
      menuList: menuList
    });
  };

  //格式化日期
  _formateDate(date) {
    if (date instanceof Date) {
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
    }
  }
}

const styles = {
  headerBar: {
    background: '#ffffff',
    padding: '10px 20px',
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } as any,
  timeBox: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  } as any,
  itemCur: {
    color: '#F56C1D',
    backgroundColor:'rgba(245,108,29,0.06)',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  }
};
