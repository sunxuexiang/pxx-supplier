import React from 'react';
import { Popover, Button, Row, Col, Checkbox, Icon } from 'antd';

interface PopupProps {
  popContent?: any;
  checkedArray?: any;
  maxCheckedCount?: number;
  onSubmit?: Function;
  selfIndicators?: any; //推荐指标
}

/**
 * 自定义指标组件
 */
export default class IndicatorPopver extends React.Component<PopupProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      popContent: props.popContent,
      checkedArray:
        this._mapObjectArrayToKeyArray(props.checkedArray) || []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.state.visible &&
        this.state.checkedArray.length != nextProps.checkedArray.length) ||
      this.props.checkedArray != nextProps.checkedArray
    ) {
      this.setState({
        checkedArray: this._mapObjectArrayToKeyArray(nextProps.checkedArray)
      });
    }
    if (this.props.popContent != nextProps.popContent) {
      this.setState({ popContent: nextProps.popContent });
    }
    return true;
  }

  render() {
    const checkedArray = this.state.checkedArray;
    const popoverContent = (
      <div style={styles.static}>
        {this.state.popContent.map((v, i) => (
          <Row key={i} style={styles.contentRow}>
            <Col span={3}>{v.title}</Col>
            <Col span={21}>
              {v.data.map((item, j) => {
                let checked = false;
                if (checkedArray.indexOf(item.key) != -1) checked = true;
                return (
                  <label style={styles.item} key={j}>
                    <Checkbox
                      checked={checked}
                      onChange={e =>
                        this._changeData(
                          (e.target as any).checked,
                          item.title,
                          item.key
                        )
                      }
                    />
                    <span style={{ paddingLeft: 2 }}>{item.title}</span>
                  </label>
                );
              })}
            </Col>
          </Row>
        ))}
      </div>
    );
    return (
      <div id="trade" className="trade-pop">
        <Popover
          visible={this.state.visible}
          onVisibleChange={visible => this._handleChange(visible)}
          title={
            <div style={styles.header}>
              <h4 style={styles.title}>
                可同时选择{this.props.maxCheckedCount}项指标&nbsp;&nbsp;&nbsp;<a
                  style={{ color: '#F56C1D' }}
                  onClick={this._renderSelfIndicators}
                >
                  推荐指标
                </a>
              </h4>
              <div>
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => this._cancelCheck()}
                >
                  取消
                </Button>
                <Button type="primary" onClick={this._onSubmit}>
                  确定
                </Button>
              </div>
            </div>
          }
          placement="bottomLeft"
          content={popoverContent}
          trigger="click"
          getPopupContainer={() => document.getElementById('trade')}
        >
          <Button>
            <Icon type="line-chart" />自定义指标
          </Button>
        </Popover>
      </div>
    );
  }

  _onSubmit = () => {
    const checkedArray = this.state.checkedArray;
    let result = [];
    this.state.popContent.forEach(bigData => {
      bigData.data.forEach(value => {
        if (checkedArray.indexOf(value.key) != -1) {
          result.push({ title: value.title, key: value.key });
        }
      });
    });
    //关闭窗口
    this.setState({
      visible: false
    });
    this.props.onSubmit(result);
  };

  _mapObjectArrayToKeyArray = array => {
    if (array) {
      let result = [];
      array.forEach(value => {
        result.push(value.key);
      });
      return result;
    }
  };

  /**
   * 复选框选中改变数据
   * @param checked
   * @param title
   * @param key
   * @private
   */
  _changeData = (checked, _title, key) => {
    let { checkedArray } = this.state;
    if (checked) {
      if (checkedArray.length >= this.props.maxCheckedCount) {
        checkedArray.pop();
      }
      checkedArray.push(key);
    } else {
      if (checkedArray.indexOf(key) != -1 && checkedArray.length > 1) {
        checkedArray.splice(checkedArray.indexOf(key), 1);
      }
    }
    this.setState({ checkedArray: checkedArray });
  };

  /**
   * 取消选中
   * @private
   */
  _cancelCheck = () => {
    this.setState({
      visible: false,
      checkedArray: this._mapObjectArrayToKeyArray(this.props.checkedArray)
    });
  };

  _renderSelfIndicators = () => {
    this.setState({
      checkedArray: this._mapObjectArrayToKeyArray(this.props.selfIndicators)
    });
  };

  //气泡卡片外部关闭监听
  _handleChange = visible => {
    this.setState({ visible: visible });
    if (this.state.visible) {
      this._cancelCheck();
    }
  };
}

const styles = {
  static: {
    width: 800
  },
  contentRow: {
    padding: 10,
    fontSize: 14
  },
  contentCol: {
    fontSize: 14,
    marginRight: 5
  },
  item: {
    width: 120,
    display: 'inline-block'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0'
  } as any,
  title: {
    fontSize: 14,
    fontWeight: 400
  } as any
};
