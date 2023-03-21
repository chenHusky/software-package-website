import { Option } from './interface';
export interface ProTableColConfig {
  // 列唯一标识字符
  key: string;
  // 列表头名字
  label: string;
  // 列表内容
  type?: 'link' | 'text';
  // type == 'link'，选填点击事件
  // eslint-disable-next-line no-unused-vars
  click?: (T?: any) => void;
  // 过滤方式
  filtersConfig?: ProTableFilterConfig;
  // 多级表头
  children?: ProTableColConfig[];
}

// 过滤方式
interface ProTableFilterConfig {
  search?: boolean;
  select?: SelectOptionConfig;
}

export type SelectOptionConfig = Option;
