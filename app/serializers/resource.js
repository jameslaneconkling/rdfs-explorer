import DS from 'ember-data';
import ApplicationSerializer from './application';

function rename(names, hash) {
  names.forEach(([from, to]) => {
    hash[to] = hash[from];
    delete hash[from];
  });

  return hash;
}

function generateObjectId(obj) {
  return encodeURIComponent(`${obj.resourceId}/${obj.attributeId}/${obj.id}`);
}

function generatePredicateId(predicate) {
  return encodeURIComponent(`${predicate.resourceId}/${predicate.id}`);
}

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

    // temp - remove unnecessary attributes
    // delete resAsJSONAPI.data.attributes.content;
    // delete resAsJSONAPI.data.attributes.timemap;
    // delete resAsJSONAPI.data.attributes.communityTags;
    // delete resAsJSONAPI.data.attributes.personalTags;
    // resAsJSONAPI.included.filterBy('type', 'predicate').forEach(predicate => delete predicate.attributes.values);

    return resAsJSONAPI;
  },

  normalizeResource(type, hash) {
    let relationships = hash.content && hash.content.attributes ?
      {
        predicates: {
          data: hash.content.attributes.map(attr => ({ type: 'predicate', id: generatePredicateId(attr)}))
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
          data: hash.values.map(object => ({ type: 'object', id: generateObjectId(object) }))
        }
      } : {};

    return {
      type: 'predicate',
      id: generatePredicateId(hash),
      attributes: hash,
      relationships: relationships
      //resource: encodeURIComponent(hash.resourceId)
    };
  },

  normalizeObject(type, hash) {
    return {
      type: 'object',
      id: generateObjectId(hash),
      attributes: rename([['data', 'value']], hash)
      // predicate: hash.predicateId
    };
  }
});

// TURN THIS
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

// INTO THIS
// {
//   "data": {
//     "type": "resource",
//     "id": "http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fdoc%2F2",
//     "attributes": {
//       "id": "http://localhost:8080/api/doc/2",
//       "dateTime": "Tue, 29 Mar 2016 00:43:44 GMT",
//       "createdDate": 1459212224352,
//       "title": "Honolulu",
//       "documentType": "object",
//       "cannotDisplay": false,
//       "versionTimestamp": 1459212224000
//     },
//     "relationships": {
//       "predicates": {
//         "data": [
//           {
//             "type": "predicate",
//             "id": "schema:name"
//           },
//           {
//             "type": "predicate",
//             "id": "gn:population"
//           },
//           {
//             "type": "predicate",
//             "id": "gsp:asWKT"
//           }
//         ]
//       }
//     }
//   },
//   "included": [
//     {
//       "type": "predicate",
//       "id": "schema:name",
//       "attributes": {
//         "id": "schema:name",
//         "name": "schema:name",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "type": "text"
//       },
//       "relationships": {
//         "objects": {
//           "data": [
//             {
//               "type": "object",
//               "id": "http://localhost:8080/api/doc/2/schema:name/0"
//             },
//             {
//               "type": "object",
//               "id": "http://localhost:8080/api/doc/2/schema:name/1"
//             }
//           ]
//         }
//       }
//     },
//     {
//       "type": "predicate",
//       "id": "gn:population",
//       "attributes": {
//         "id": "gn:population",
//         "name": "gn:population",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "type": "decimal"
//       },
//       "relationships": {
//         "objects": {
//           "data": [
//             {
//               "type": "object",
//               "id": "http://localhost:8080/api/doc/2/gn:population/0"
//             }
//           ]
//         }
//       }
//     },
//     {
//       "type": "predicate",
//       "id": "gsp:asWKT",
//       "attributes": {
//         "id": "gsp:asWKT",
//         "name": "gsp:asWKT",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "type": "geometry"
//       },
//       "relationships": {
//         "objects": {
//           "data": [
//             {
//               "type": "object",
//               "id": "http://localhost:8080/api/doc/2/gsp:asWKT/0"
//             }
//           ]
//         }
//       }
//     },
//     {
//       "type": "object",
//       "id": "http://localhost:8080/api/doc/2/schema:name/0",
//       "attributes": {
//         "id": "0",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "attributeId": "schema:name",
//         "feedbackSummary": {
//           "numberComments": 0,
//           "numberRatings": 0
//         },
//         "microdata": {
//           "transactionStartId": "1"
//         },
//         "value": "Honolulu"
//       }
//     },
//     {
//       "type": "object",
//       "id": "http://localhost:8080/api/doc/2/schema:name/1",
//       "attributes": {
//         "id": "1",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "attributeId": "schema:name",
//         "feedbackSummary": {
//           "numberComments": 0,
//           "numberRatings": 0
//         },
//         "microdata": {
//           "transactionStartId": "1"
//         },
//         "value": "Honolulu"
//       }
//     },
//     {
//       "type": "object",
//       "id": "http://localhost:8080/api/doc/2/gn:population/0",
//       "attributes": {
//         "id": "0",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "attributeId": "gn:population",
//         "feedbackSummary": {
//           "numberComments": 0,
//           "numberRatings": 0
//         },
//         "microdata": {
//           "transactionStartId": "1"
//         },
//         "value": "371657"
//       }
//     },
//     {
//       "type": "object",
//       "id": "http://localhost:8080/api/doc/2/gsp:asWKT/0",
//       "attributes": {
//         "id": "0",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "attributeId": "gsp:asWKT",
//         "feedbackSummary": {
//           "numberComments": 0,
//           "numberRatings": 0
//         },
//         "microdata": {
//           "transactionStartId": "1"
//         },
//         "value": "POINT(-157.85833 21.30694)"
//       }
//     }
//   ]
// }
