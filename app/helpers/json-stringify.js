import Ember from 'ember';

export function jsonStringify(params/*, hash*/) {
  return JSON.stringify(params);
}

export default Ember.Helper.helper(jsonStringify);
