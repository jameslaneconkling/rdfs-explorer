import DS from 'ember-data';

export default DS.Adapter.extend({
  url:       'http://localhost:3001/',
  namespace: 'api/'
});
