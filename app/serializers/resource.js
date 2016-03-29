import DS from 'ember-data';
import ApplicationSerializer from './application';

function rename(names, hash) {
  names.forEach(([from, to]) => {
    hash[to] = hash[from];
    delete hash[from];
  });

  return hash;
};

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
      data: data.documents.map(resource => this.normalizeResource(type, resource))
    };
  },

  normalizeSingleResponse(type, data) {
    // TODO - centralize predicate normalization
    let predicates = data.content && data.content.attributes ?
      data.content.attributes.map(attr => this.normalizePredicate(type, attr)) : [];

    let objects = data.content && data.content.attributes ?
      data.content.attributes.map(attr => {
        return attr.values.map(object => this.normalizeObject(type, object));
      })
      .reduce((flatObjects, objArrays) => flatObjects.concat(objArrays), []) : [];

    let resAsJSONAPI = {
      data: this.normalizeResource(type, data),
      included: [].concat(predicates, objects)
    };

    return resAsJSONAPI;
  },

  normalizeResource(type, hash) {
    let relationships = hash.content && hash.content.attributes ?
      {
        predicates: {
          data: hash.content.attributes.map(attr => ({ type: 'predicate', id: attr.id}))
        }
      } : {};

    return {
      type: 'resource',
      id: encodeURIComponent(hash.id),
      attributes: hash,
      relationships: relationships,
    };
  },

  normalizePredicate(type, hash) {
    let relationships = hash.values ?
      {
        objects: {
          data: hash.values.map(object => ({ type: 'object', id: object.id}))
        }
      } : {};

    return {
      type: 'predicate',
      id: hash.id,
      attributes: hash,
      relationships: relationships
      //resource: encodeURIComponent(hash.resourceId)
    };
  },

  normalizeObject(type, hash) {
    return {
      type: 'object',
      id: hash.id,
      attributes: rename([['data', 'value']], hash)
      // predicate: hash.predicateId
    };
  }
});


// {
//   "id": "http://localhost:8080/api/doc/2",
//   "dateTime": "Tue, 29 Mar 2016 00:43:44 GMT",
//   "createdDate": 1459212224352,
//   "title": "Honolulu",
//   "documentType": "object",
//   "cannotDisplay": false,
//   "content": {
//     "attributes": [
//       {
//         "id": "schema:name",
//         "name": "schema:name",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "type": "text",
//         "values": [
//           {
//             "id": "0",
//             "resourceId": "http://localhost:8080/api/doc/2",
//             "attributeId": "schema:name",
//             "data": "Honolulu",
//             "feedbackSummary": {
//               "numberComments": 0,
//               "numberRatings": 0
//             },
//             "microdata": {
//               "transactionStartId": "1"
//             }
//           },
//           {
//             "id": "1",
//             "resourceId": "http://localhost:8080/api/doc/2",
//             "attributeId": "schema:name",
//             "data": "Honolulu",
//             "feedbackSummary": {
//               "numberComments": 0,
//               "numberRatings": 0
//             },
//             "microdata": {
//               "transactionStartId": "1"
//             }
//           }
//         ]
//       },
//       ...
//     ],
//     "objectSummary": {
//       "numAttachments": 0,
//       "numComments": 0
//     }
//   },
//   "communityTags": [
//     "test"
//   ],
//   "personalTags": [
//     "test"
//   ],
//   "versionTimestamp": 1459212224000,
//   "timemap": [
//     {
//       "href": "http://localhost:8080/api/doc/2",
//       "rel": "original timegate"
//     },
//     {
//       "href": "http://localhost:8080/api/doc/2?timestamp=1459212224352",
//       "rel": "memento",
//       "dateTime": "Tue, 29 Mar 2016 00:43:44 GMT",
//       "count": "7"
//     }
//   ]
// }
