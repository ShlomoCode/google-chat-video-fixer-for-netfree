import { sendEvent } from './analytics.js';

if (document.referrer.includes('chat.google.com')) {
  sendEvent('iframe_loaded');
}
