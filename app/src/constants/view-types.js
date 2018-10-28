import { addDays, format } from 'date-fns';

export const BET_VIEW_TYPES = [
  { key: 'active', title: 'Active' },
  { key: 'completed', title: 'Completed' },
  { key: 'pending', title: 'Pending' },
];

const now = new Date();
export const DATE_VIEW_TYPES = [...Array(7)].map((_, index) => {
  const date = addDays(now, index);
  return {
    key: format(date, 'MMDDYYYY'),
    title: index === 0 ? 'Today' : format(date, 'MMM D'),
  };
});
