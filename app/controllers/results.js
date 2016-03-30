import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['q'],

  queryString: Ember.computed.alias('q')
});
