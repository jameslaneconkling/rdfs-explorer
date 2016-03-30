import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    // TODO - findRecord('object', params.resourceId, params.predicateId, params.rdfObjectId) ?
    return this.store.findRecord('resource', params.resourceId)
      .then(resource => {
        return resource
          .get('predicates').findBy('id', params.predicateId)
          .get('objects').findBy('id', params.rdfObjectId)
      });
  }
});
