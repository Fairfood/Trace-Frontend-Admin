/* eslint-disable @typescript-eslint/no-explicit-any */
import { MONTH_ABB } from 'src/app/core/utils/app.constants';
import { environment } from 'src/environments/environment';
/**
 * start year can be configured in the environment
 * its used in year dropdown for the graph data
 * start year depicts the first transaction year for the environment
 *
 * method just generate an array of objects like the YearObj interface
 */
const generateLastNYears = (): any[] => {
  let currentYear = new Date().getFullYear();
  const years = [];
  const startYear = environment.startYear;

  while (startYear <= currentYear) {
    years.push({
      name: currentYear,
      id: `${currentYear}`,
      startDate: `${currentYear}-01-01`,
      endDate: `${currentYear}-12-31`,
    });
    currentYear--;
  }

  return years;
};

/**
 * Returning a date in the format 'yyyy-mm-dd'
 * n - means how much backwards shoud go
 *
 * @param n number
 * @returns string
 */
export const previousStartDate = (n: number): string => {
  const current = new Date();
  current.setMonth(current.getMonth() - (n - 1));

  let month;

  if (current.getMonth() + 1 < 10) {
    month = `0${current.getMonth() + 1}`;
  } else {
    month = current.getMonth() + 1;
  }

  // n=== 0 means requesting the current date in the format yyyy-mm-dd
  if (n === 0) {
    let day;
    // appending 0 for better readability
    if (current.getDate() < 10) {
      day = `0${current.getDate()}`;
    } else {
      day = current.getDate();
    }

    return `${current.getFullYear()}-${month}-${day}`;
  }

  return `${current.getFullYear()}-${month}-01`;
};

export interface YearObj {
  name: string;
  id: string;
  startDate: string;
  endDate: string;
}

export const YEAR_DROPDOWN: YearObj[] = [
  {
    name: 'Last 6 months',
    id: '6M',
    startDate: previousStartDate(6),
    endDate: previousStartDate(0),
  },
  {
    name: 'Last 12 months',
    id: '12M',
    startDate: previousStartDate(12),
    endDate: previousStartDate(0),
  },
  ...generateLastNYears(),
];

export const generatePrevMonthArray = (n: number): string[] => {
  const today = new Date();
  let d;
  const months = [];

  for (let i = n; i > 0; i -= 1) {
    d = new Date(today.getFullYear(), today.getMonth() - (i - 1), 1);
    months.push(MONTH_ABB[d.getMonth()]);
  }
  return months;
};

const verifyMonthlyValues = (series: any[], monthArray: string[]): any[] => {
  const newSeries: any[] = [];
  monthArray.map((month: string) => {
    const index = series.findIndex(f => f.name === month);
    if (index > -1) {
      newSeries.push(series[index]);
    } else {
      newSeries.push({
        name: month,
        value: 0,
      });
    }
  });

  return newSeries;
};

export const genericFormatterChart = (
  inputArray: any[],
  titles: string[],
  valuesKey: string[],
  id: string
) => {
  const result = [];
  const seriesA = [];
  const seriesB = [];

  for (let index = 0; index < inputArray.length; index++) {
    const element = inputArray[index];

    const monthAbb = new Date(element.grouped_by).getMonth();
    if (titles.length === 2) {
      seriesA.push({
        name: MONTH_ABB[monthAbb],
        value: element[valuesKey[0]],
      });
      seriesB.push({
        name: MONTH_ABB[monthAbb],
        value: element[valuesKey[1]],
      });
    } else {
      seriesA.push({
        name: MONTH_ABB[monthAbb],
        value: element[valuesKey[0]],
      });
    }
  }

  const isYear = ['6M', '12M'].includes(id) ? false : true;

  let monthList: string[] = [];

  if (isYear) {
    monthList = MONTH_ABB;
  } else {
    monthList = generatePrevMonthArray(id === '12M' ? 12 : 6);
  }

  if (titles.length === 2) {
    result.push({
      name: titles[0],
      series: verifyMonthlyValues(seriesA, monthList),
    });
    result.push({
      name: titles[1],
      series: verifyMonthlyValues(seriesB, monthList),
    });
  } else {
    result.push({
      name: titles[0],
      series: verifyMonthlyValues(seriesA, monthList),
    });
  }

  return result;
};
