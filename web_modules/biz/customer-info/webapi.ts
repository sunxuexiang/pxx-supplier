import { Fetch } from 'qmkit';

const employeeList = () => {
  return Fetch(`/customer/employee/allEmployees`);
};

const customerLevelList = () => {
  return Fetch(`/customer/levellist`);
};

export { employeeList, customerLevelList };
