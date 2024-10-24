import { bexBackground } from 'quasar/wrappers';
import networkRules from './network-rules';

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: networkRules.map((rule) => rule.id), // remove existing rules
  addRules: networkRules,
});

export default bexBackground(() => {});
