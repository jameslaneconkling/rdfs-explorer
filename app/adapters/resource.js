import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  findAll(store, type) {
    let searchOptions = {
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
    };

    return Ember.$.ajax({
      type: 'POST',
      url: this.namespace + 'search',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(searchOptions)
    });
  },

  findRecord(store, type, id) {
    return Ember.$.get(this.namespace + 'document/' + id);
  },

  queryRecord() {
  }
});
