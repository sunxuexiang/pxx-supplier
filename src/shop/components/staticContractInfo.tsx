import moment from 'moment';

const staticData = {
  chargingStandards: '按交易结算金额的0.6%收费',
  unitConfirmation: '法大大',
  unitlogin: '喜吖吖惠市宝',
  applicationSigningDate: moment()
    .add(10, 'y')
    .endOf('year')
    .format('YYYY-MM-DD'),
  periodStart: moment()
    .endOf('day')
    .format('YYYY-MM-DD'),
  periodEnd: moment()
    .add(10, 'y')
    .endOf('day')
    .format('YYYY-MM-DD')
};

export default staticData;

export const validatorBank = (rule, value, callback) => {
  if (value && value.includes('银行')) {
    callback('此处无需填写“银行”字样');
  }
  callback();
};

export const validatorBankChild = (rule, value, callback) => {
  if (value && (value.includes('支行') || value.includes('分行'))) {
    callback('此处无需填写“支行”或“分行”字样');
  }
  callback();
};
