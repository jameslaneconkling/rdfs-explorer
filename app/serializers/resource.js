import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, type, data, id, requestType) {
    return {
      data: data.documents.map(resource => this.normalize('resource', resource))
    };
  },

  normalize(type, hash) {
    return {
      type: 'resource', // or type.modelName
      id: hash.id,
      attributes: hash
    };
  }
});
