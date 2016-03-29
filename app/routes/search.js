import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // TODO - user queryRecord()
    return this.store.findAll('resource');
  }
});
