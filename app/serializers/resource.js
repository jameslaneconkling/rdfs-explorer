import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeResponse(store, type, data, id, requestType) {
    if (requestType === 'findAll') {
      return this.normalizeSearchResponse('resource', data);
    } else if (requestType === 'findRecord') {
      return this.normalizeSingleResponse('response', data);
    }
  },

  normalizeSearchResponse(type, data) {
    return {
      data: data.documents.map(resource => this.normalize(type, resource))
    };
  },

  normalizeSingleResponse(type, data) {
    let predicates = data.content.attributes.map(attr => ({
      type: 'predicate',
      id: attr.id,
      attributes: attr
    }));

    return {
      data: this.normalize(type, data),
      links: {
        self: this.url + this.namespace + 'document/' + data.id
      },
      included: predicates
    };
  },

  normalize(type, hash) {
    return {
      type: 'resource', // or type.modelName
      id: encodeURIComponent(hash.id),
      attributes: hash
    };
  }
});
