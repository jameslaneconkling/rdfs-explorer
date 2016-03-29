import Ember      from 'ember';

export function jsonStringify([json], hash) {
  return Ember.String.htmlSafe(`<code>${JSON.stringify(json)}</code>`);
}

export default Ember.Helper.helper(jsonStringify);
