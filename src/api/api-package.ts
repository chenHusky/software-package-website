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
