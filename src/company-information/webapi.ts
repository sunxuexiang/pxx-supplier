import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export const fetchCompanyInfo = () => {
  return Fetch('/companyInfo');
};

export const saveCompanyInfo = (params = {}) => {
  return Fetch<TResult>('/companyInfo', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};
