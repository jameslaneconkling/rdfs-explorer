import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.query('resource', { criteria: params});
  },

  actions: {
    submit() {
      this.transitionTo('results', { queryParams: { q: this.get('queryString') }});
      this.refresh();
    },

    updateQueryString(string) {
      this.set('queryString', string);
    }
  }
});
