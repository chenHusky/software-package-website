import { Option } from './interface';

export interface FormRadioConfig extends Option {
  label: string;
  id: string;
  type?: 'select' | 'radio';
  showDoneIcon?: boolean;
}
