import { addDays, format } from 'date-fns';

export const HUNCH_VIEW_TYPES = [
  { key: 'ACTIVE', title: 'Active' },
  { key: 'COMPLETED', title: 'Completed' },
  { key: 'PENDING', title: 'Pending' },
];

const now = new Date();
export const DATE_VIEW_TYPES = [...Array(10)].map((_, index) => {
  const date = addDays(now, index);
  return {
    key: format(date, 'MMDDYYYY'),
    title: index === 0 ? 'Today' : format(date, 'ddd       MMM D'),
  };
});

export const LEAGUE_VIEW_TYPES = [
  { key: 'NBA', title: 'NBA' },
];
