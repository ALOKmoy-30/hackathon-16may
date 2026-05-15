import { getDataSourceMode } from '../services/dataSource.js';

export function DataSourceBadge() {
  const { isRealData, label } = getDataSourceMode();

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isRealData
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-white'
      }`}
    >
      {label}
    </span>
  );
}
