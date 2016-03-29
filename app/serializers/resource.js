import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, type, data, id, requestType) {
    if (requestType === 'findAll') {
      return {
        data: data.documents.map(resource => this.normalize('resource', resource))
      };
    } else if (requestType === 'findRecord') {
      return {
        data: this.normalize('resource', data)
      };
    }
  },

  normalize(type, hash) {
    return {
      type: 'resource', // or type.modelName
      id: encodeURIComponent(hash.id),
      attributes: hash
    };
  }
});
