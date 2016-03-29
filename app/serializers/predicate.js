import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeResponse(store, type, data, id, requestType) {
    console.log('normalizeResponse for predicate', data);
    this._super(...arguments);
  }
});
