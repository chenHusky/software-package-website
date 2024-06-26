import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { FeatureInfo, GroupInfo } from '@/shared/@types/interface';
import { getHeaderConfig } from './util';
/**
 * 获取sig landscape
 * @returns {Promise<GroupInfo[]>}
 */
export function getSigLandscape(lang: string): Promise<GroupInfo[]> {
  const url = '/api/v1/sig';
  return request.get(url, getHeaderConfig()).then((res: AxiosResponse) => {
    const data = res.data?.data;

    const info: GroupInfo[] = [];
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      lang === 'zh'
        ? ''
        : ((item.group = item.en_group), (item.feature = item.en_feature));
      if (item.group === '' && item.feature === '') {
        continue;
      }

      if (
        !info.find((group: GroupInfo) => {
          return group.groupName === item.group;
        })
      ) {
        info.push({
          groupName: item.group,
          features: [],
        });
      }

      const groupInfo: GroupInfo | undefined = info.find((group: GroupInfo) => {
        return group.groupName === item.group;
      });

      if (
        !groupInfo?.features.find((feature: any) => {
          return feature.featureName === item.feature;
        })
      ) {
        groupInfo?.features.push({
          featureName: item.feature,
          sigs: [],
        });
      }

      const featureInfo: FeatureInfo | undefined = groupInfo?.features.find(
        (feature: FeatureInfo) => {
          return feature.featureName === item.feature;
        }
      );
      featureInfo?.sigs.push(item.sig_names);
    }
    info.sort((b: GroupInfo, a: GroupInfo) => {
      return a.features.length - b.features.length;
    });
    info.forEach((group: GroupInfo) => {
      group.features.sort((b: FeatureInfo, a: FeatureInfo) => {
        return a.sigs.length - b.sigs.length;
      });
      group.features.forEach((feature: FeatureInfo) => {
        feature.sigs.sort((b: string, a: string) => {
          return b.toLowerCase().localeCompare(a);
        });
      });
    });
    return info;
  });
}

/**
 *TC组成员所管理的sig组列表
 */
export function queryTCSigs() {
  const url = '/query/TC/sigs?community=openeuler';
  return request
    .get(url, { global: true, ...getHeaderConfig() })
    .then((res: AxiosResponse) => res.data);
}
