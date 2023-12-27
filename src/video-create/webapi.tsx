import { Fetch } from 'qmkit';

export function addVideo(params) {
  return Fetch<any>('/videomanagement/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function modifyVideo(params) {
  return Fetch<any>('/videomanagement/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export function getVideo(videoId) {
  return Fetch<any>(`/videomanagement/getDetailsById/${videoId}`, {
    method: 'GET'
  });
}
