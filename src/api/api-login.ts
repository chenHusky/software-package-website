/**
 * @file  登录接口配置文件
 * */

import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';
import { ElMessage } from 'element-plus';

/**
 * 获取授权的相关回调链接
 */
type queryPermissionParams = {
  community: string;
};

function getHeaderConfig(): { headers: any } {
  const { token } = getUserAuth();
  const headersConfig = {
    headers: {
      token,
    },
  };
  return headersConfig;
}
export function queryPermission(params: queryPermissionParams) {
  const url = '/api-omapi/oneid/personal/center/user';
  return request
    .get(url, {
      params,
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => {
      const message = err?.response?.data?.message || '';
      if (message && message !== 'token expires') {
        ElMessage({
          type: 'error',
          message: err.message,
        });
      }
    });
}

/**
 * 查询用户信息
 */
export function queryPersonalInfo() {
  const url = '/api-omapi/oneid/personal/center/user?community=openeuler';
  return request
    .get(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => {
      const message = err?.response?.data?.message || '';
      if (message && message !== 'token expires') {
        ElMessage({
          type: 'error',
          message: err.message,
        });
      }
    });
}
