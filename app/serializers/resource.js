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
    let predicates = data.content && data.content.attributes ?
      data.content.attributes.map(attr => ({
        type: 'predicate',
        id: attr.id,
        attributes: attr,
        resource: encodeURIComponent(data.id)
      })) : [];

    let resAsJSONAPI = {
      data: this.normalize(type, data),
      included: predicates
    };

    return resAsJSONAPI;
    // this._super(type, resAsJSONAPI);
  },

  normalize(type, hash) {
    let relationships = hash.content && hash.content.attributes ?
      {
        predicates: {
          data: hash.content.attributes.map(attr => ({ type: 'predicate', id: attr.id}))
        }
      } : {};

    return {
      type: 'resource', // or type.modelName
      id: encodeURIComponent(hash.id),
      attributes: hash,
      relationships: relationships,
      // links: {
      //   self: this.url + this.namespace + 'document/' + encodeURIComponent(hash.id)
      // },
    };
  }
});
