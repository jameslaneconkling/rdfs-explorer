import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
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
    return {
      data: this.normalize(type, data)
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
