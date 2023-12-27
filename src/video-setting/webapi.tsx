import { Fetch } from 'qmkit';

export function getpage(params) {
  return Fetch<any>('/videomanagement/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
export function updateStateById(params) {
  return Fetch<any>('/videomanagement/updateStateById', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export function delvideo(videoId) {
  return Fetch<any>(`/videomanagement/deleteById/${videoId}`, {
    method: 'DELETE'
  });
}
