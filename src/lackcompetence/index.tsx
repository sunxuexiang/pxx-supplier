import React from 'react';
const ghost = require('./img/ghost.gif');
export default class LackCompetence extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.row}>
          <img src={ghost} />
          <div>
            <h2 style={styles.h2}>抱歉！您没有权限访问</h2>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#d5dde1'
  } as any,
  h2: {
    color: '#454e57',
    fontSize: 30,
    marginTop: 35,
    marginBottom: 12,
    fontWeight: 500
  } as any,
  line: {
    color: '#64707d',
    fontSize: 16
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any
};
