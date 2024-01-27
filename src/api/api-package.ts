import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getHeaderConfig } from './util';
import { useLangStore } from '@/stores';

/**
 * 申请新软件包
 */

export function addSoftware(params: any) {
  const url = '/api/v1/softwarepkg';
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 软件包列表
export function querySoftwareList(params: any) {
  const url = '/api/v1/softwarepkg';
  return request
    .get(url, {
      params,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data);
}

// 软件包详情
export function getSoftwareDetail(id: string) {
  const url = `/api/v1/softwarepkg/${id}`;
  const params = {
    language: useLangStore().lang === 'zh' ? 'chinese' : 'english',
  };
  return request
    .get(url, {
      params,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data);
}

/**
 * 修改软件包
 */

export function modifySoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 重启ci
export function rerunCI(id: string) {
  const url = `/api/v1/softwarepkg/${id}/retest`;
  return request
    .put(url, undefined, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}
// 放弃申请软件包
export function abandonSoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/close`;
  return request
    .put(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 获取评论列表
export function getComments(id: string) {
  const url = `/api/v1/softwarepkg/${id}/review/comment`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 评论申请软件包
export function commentSoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/review/comment`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 翻译评论
export function translateComment(ids: any, params: any) {
  const url = `/api/v1/softwarepkg/${ids.id}/review/comment/${ids.cid}/translate`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 是否填写cla
export function getVerifyCla() {
  const url = `/api/v1/cla`;
  return request
    .get(url, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// check committer
export function checkCommitters(params: any) {
  const url = '/api/v1/softwarepkg/committers';
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}

// 获取review列表
export function getReviewList(id: string) {
  const url = `/api/v1/softwarepkg/${id}/review`;
  const params = {
    language: useLangStore().lang === 'zh' ? 'chinese' : 'english',
  };
  return request
    .get(url, {
      params,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data);
}

// 发送review
export function postReview(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/review`;
  return request
    .post(url, params, getHeaderConfig())
    .then((res: AxiosResponse) => res.data);
}
