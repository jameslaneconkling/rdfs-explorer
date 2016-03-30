import Ember from 'ember';

export default Ember.Route.extend({
  queryString: '',

  actions: {
    submit() {
      console.log(this.get('queryString'));
    },

    updateQueryString(string) {
      this.set('queryString', string);
    }
  }
});
