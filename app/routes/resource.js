import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findRecord('resource', 'http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fdoc%2F2');
  }
});
