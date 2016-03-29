import DS from 'ember-data';

export default DS.Model.extend({
  value:           DS.attr('string'),
  feedbackSummary: DS.attr(),
  microdata:       DS.attr(),
  predicate:       DS.belongsTo('predicate')
});
