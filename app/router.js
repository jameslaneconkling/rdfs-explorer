import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('search');
  this.route('resource', { path: '/resource/:id'});
  this.route('rdfobject', { path: '/resource/:resourceId/predicate/:predicateId/rdfobject/:rdfObjectId'});
});

export default Router;
