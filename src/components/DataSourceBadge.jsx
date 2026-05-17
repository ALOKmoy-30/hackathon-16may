import { getDataSourceMode } from '../services/dataSource.js';
import { getTelegramStatus } from '../services/telegramService.js';

export function DataSourceBadge() {
  const { isRealData } = getDataSourceMode();
  const { connected } = getTelegramStatus();

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        isRealData && connected
          ? 'bg-[#0a1f0f] text-[#00ff88] border-[#00ff88]/30'
          : 'bg-[#1f1400] text-[#ffaa00] border-[#ffaa00]/30'
      }`}
    >
      {isRealData && connected ? 'Live Telegram Data' : 'Dummy Data (Telegram Disconnected)'}
    </span>
  );
}
