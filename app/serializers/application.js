import DS from 'ember-data';

// TODO - why JSONAPISerializer vs RESTSerializer vs Serializer
export default DS.JSONAPISerializer.extend({
  url:       'http://localhost:3001/',
  namespace: 'api/'
});
