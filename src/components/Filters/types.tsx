export type Option = {
  label: string;
  value: string | number;
};

export type SelectFilter = {
  keyName: string;
  options: Option[];
  label: string;
  type: 'select';
};

export type DateFilter = {
  label: string;
  keyNameTo: string;
  keyNameFrom: string;
  type: 'date';
};

export type RangeFilter = {
  type: 'range';
  keyNameMin: string;
  keyNameMax: string;
  labelMin: string;
  labelMax: string;
  label: string;
};

/**
 * example
 * {
 *    type: 'range',
 *    keyNameMin: 'minPrice',
 *    keyNameMax: 'maxPrice',
 *    labelMin: t('int.min-price'),
 *    labelMax: t('int.max-price'),
 *    label: t('int.min-max-price')
 * },
 * */
export type NumberFilter = {
  type: 'number';
  min: number;
  max: number;
  label: string;
  keyName: string;
};

export type FilterType = SelectFilter | DateFilter | NumberFilter | RangeFilter;
