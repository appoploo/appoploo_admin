import { format } from 'date-fns';

export const formatDate = (date?: Date | number) =>
  date ? format(+date, 'd MMM yyy, hh:mm') : '';

export const debounce = (func: any, wait: any, immediate?: any) => {
  let timeout: any;

  return function(...args: any) {
    //@ts-ignore
    let context = this;

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (immediate && !timeout) {
      func.apply(context, args);
    }
  };
};
export const EUROSIGN = '€';
export const SECOND = 1000;

export function applyDiscount(discount: number = 0, price?: number) {
  if (!price) return '';
  return `${(price * ((100 - discount) / 100)).toFixed(2)} €`;
}

export const colorArray = [
  '#FF66334f',
  '#FFB3994f',
  '#FF33FF4f',
  '#FFFF994f',
  '#00B3E64f',
  '#E6B3334f',
  '#3366E64f',
  '#9999664f',
  '#99FF994f',
  '#B34D4D4f',
  '#80B3004f',
  '#8099004f',
  '#E6B3B34f',
  '#6680B34f',
  '#66991A4f',
  '#FF99E64f',
  '#CCFF1A4f',
  '#FF1A664f',
  '#E6331A4f',
  '#33FFCC4f',
  '#66994D4f',
  '#B366CC4f',
  '#4D80004f',
  '#B333004f',
  '#CC80CC4f',
  '#66664D4f',
  '#991AFF4f',
  '#E666FF4f',
  '#4DB3FF4f',
  '#1AB3994f',
  '#E666B34f',
  '#33991A4f',
  '#CC99994f',
  '#B3B31A4f',
  '#00E6804f',
  '#4D80664f',
  '#8099804f',
  '#E6FF804f',
  '#1AFF334f',
  '#9999334f',
  '#FF33804f',
  '#CCCC004f',
  '#66E64D4f',
  '#4D80CC4f',
  '#9900B34f',
  '#E64D664f',
  '#4DB3804f',
  '#FF4D4D4f',
  '#99E6E64f',
  '#6666FF4f'
];
