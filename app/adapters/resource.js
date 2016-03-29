import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  findRecord(store, type, id) {
    return Ember.$.get(this.namespace + 'document/' + id);
  }
});
