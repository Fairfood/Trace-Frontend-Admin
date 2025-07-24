// import { previousStartDate, generatePrevMonthArray, genericFormatterChart, YEAR_DROPDOWN } from './';
import { MONTH_ABB } from 'src/app/shared/configs/app.constants';
import {
  YEAR_DROPDOWN,
  generatePrevMonthArray,
  genericFormatterChart,
  previousStartDate,
} from './dashboard.config';

describe('Utility Functions', () => {
  describe('YEAR_DROPDOWN', () => {
    it('should generate a dropdown with valid start and end dates for years', () => {
      expect(YEAR_DROPDOWN.length).toBeGreaterThan(0);
      expect(YEAR_DROPDOWN[0].startDate).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(YEAR_DROPDOWN[0].endDate).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});
