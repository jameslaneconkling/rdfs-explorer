import Ember from 'ember';

export default Ember.Route.extend({
  queryString: '',

  actions: {
    submit() {
      this.transitionTo('results', { queryParams: { q: this.get('queryString') }});
    },

    updateQueryString(string) {
      this.set('queryString', string);
    }
  }
});
