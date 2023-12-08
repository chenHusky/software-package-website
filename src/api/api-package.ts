import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';
import { useLangStore } from '@/stores';

/**
 * 申请新软件包
 */

export function addSoftware(params: any) {
  const url = '/api/v1/softwarepkg';
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 软件包列表
export function querySoftwareList(params: any) {
  const url = '/api/v1/softwarepkg';
  const { token } = getUserAuth();
  return request
    .get(url, {
      params,
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 软件包详情
export function getSoftwareDetail(id: string) {
  const url = `/api/v1/softwarepkg/${id}`;
  const { token } = getUserAuth();
  const params = {
    language: useLangStore().lang === 'zh' ? 'chinese' : 'english',
  };
  return request
    .get(url, {
      params,
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

/**
 * 修改软件包
 */

export function modifySoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}`;
  const { token } = getUserAuth();
  return request
    .put(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 重启ci
export function rerunCI(id: string) {
  const url = `/api/v1/softwarepkg/${id}/retest`;
  const { token } = getUserAuth();
  return request
    .put(url, undefined, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}
// 放弃申请软件包
export function abandonSoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/close`;
  const { token } = getUserAuth();
  return request
    .put(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 获取评论列表
export function getComments(id: string) {
  const url = `/api/v1/softwarepkg/${id}/review/comment`;
  const { token } = getUserAuth();
  return request
    .get(url, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 评论申请软件包
export function commentSoftware(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/review/comment`;
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 翻译评论
export function translateComment(ids: any, params: any) {
  const url = `/api/v1/softwarepkg/${ids.id}/review/comment/${ids.cid}/translate`;
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 是否填写cla
export function getVerifyCla() {
  const url = `/api/v1/cla`;
  const { token } = getUserAuth();
  return request
    .get(url, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// check committer
export function checkCommitters(params: any) {
  const url = '/api/v1/softwarepkg/committers';
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 获取review列表
export function getReviewList(id: string) {
  const url = `/api/v1/softwarepkg/${id}/review`;
  const { token } = getUserAuth();
  const params = {
    language: useLangStore().lang === 'zh' ? 'chinese' : 'english',
  };
  return request
    .get(url, {
      params,
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 发送review
export function postReview(id: string, params: any) {
  const url = `/api/v1/softwarepkg/${id}/review`;
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}
