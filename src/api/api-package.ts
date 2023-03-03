import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';

/**
 * 申请新软件包
 */

export function addSoftware(params: any) {
  const url = '/api-package/api/v1/softwarepkg';
  const { token } = getUserAuth();
  return request
    .post(url, params, {
      headers: {
        token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 软件包列表
export function querySoftwareList(params: any) {
  const url = '/api-package/api/v1/softwarepkg';
  const { token } = getUserAuth();
  return request
    .get(url, {
      params,
      headers: {
        token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}

// 软件包详情
export function getSoftwareDetail(id: string) {
  const url = `/api-package/api/v1/softwarepkg/${id}`;
  const { token } = getUserAuth();
  return request
    .get(url, {
      headers: {
        token,
      },
    })
    .then((res: AxiosResponse) => res.data);
}
