export default function percentLabel(num) {
  if (typeof num !== 'number') return '--';
  return `${(Math.round(num * 1000) / 10).toLocaleString()}%`;
}
