// Telegram Bot API integration
// Handles sending alerts and fetching sensor data from Telegram

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

// Check if Telegram is configured
export function isTelegramConfigured() {
  return (
    TELEGRAM_BOT_TOKEN &&
    TELEGRAM_BOT_TOKEN !== 'YOUR_TOKEN_HERE' &&
    TELEGRAM_CHAT_ID &&
    TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE'
  );
}

// Send alert message to Telegram
export async function sendAlert(message) {
  if (!isTelegramConfigured()) {
    console.log('Telegram not connected — would have sent:', message);
    return { success: false, reason: 'not_configured' };
  }

  try {
    const url = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Telegram API error:', response.status);
      return { success: false, reason: 'api_error' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
    return { success: false, reason: 'network_error', error };
  }
}

// Fetch sensor data from Telegram Bot API
export async function fetchSensorData() {
  if (!isTelegramConfigured()) {
    console.log('Telegram not configured - cannot fetch real data');
    return null;
  }

  try {
    // This would be your actual Telegram Bot API endpoint
    // For now, this is a placeholder for when you implement the bot backend
    const url = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getUpdates`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Telegram API error:', response.status);
      return null;
    }

    const data = await response.json();

    // Parse and transform Telegram bot data into sensor format
    // This will depend on how your Telegram bot sends sensor data
    // For now, return null to indicate no data available
    return null;
  } catch (error) {
    console.error('Failed to fetch sensor data from Telegram:', error);
    return null;
  }
}

// Get Telegram connection status
export function getTelegramStatus() {
  if (!isTelegramConfigured()) {
    return {
      connected: false,
      message: 'Not connected — add token to .env to enable',
    };
  }

  return {
    connected: true,
    message: 'Connected ✓',
  };
}
