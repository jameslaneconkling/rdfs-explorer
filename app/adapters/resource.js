import Ember              from 'ember';
import ApplicationAdapter from './application';
import _                  from 'lodash';

export default ApplicationAdapter.extend({
  query(store, type, query = {}) {
    let searchDefaults = _.defaults(query, {
      "start": 0,
      "rows": 23,
      "fields": [],
      "facets": [],
      "criteria": {
        "sort": [],
        "q": "",
        "geo": [],
        "time": [],
        "text": [],
        "term": []
      },
      "dataSources": [],
      "log": true,
      "useDefaults": true
    });

    return Ember.$.ajax({
      type: 'POST',
      url: this.namespace + 'search',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(searchDefaults)
    });
  },

  findRecord(store, type, id) {
    return Ember.$.get(this.namespace + 'document/' + id);
  }
});
