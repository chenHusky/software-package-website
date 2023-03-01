export interface IObject<T = any> {
  [key: string]: T;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface Option {
  options: OptionItem[];
}

export interface FeatureInfo {
  featureName: string;
  sigs: string[];
}

export interface GroupInfo {
  groupName: string;
  features: FeatureInfo[];
}
