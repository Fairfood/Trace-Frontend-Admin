/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const successFormatter = (res: any) => {
  const { code, data } = res;

  if (code === 200) {
    return data;
  }

  return res;
};

export const nFormatter = (num: number, digits = 1) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

export const dateFormatterFF = (inputDate: string): string => {
  const date = new Date(inputDate);

  let month: any = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  return `${month}-01-${date.getFullYear()}`;
};
