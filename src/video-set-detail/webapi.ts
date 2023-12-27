import { Fetch } from 'qmkit';

export function getVideo(videoId) {
  return Fetch<any>(`/videomanagement/getDetailsById/${videoId}`, {
    method: 'GET'
  });
}
