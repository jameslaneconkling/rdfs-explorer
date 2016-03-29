import DS from 'ember-data';

export default DS.Model.extend({
  type:     DS.attr('string'),
  name:     DS.attr('string'),
  resource: DS.belongsTo('resource'),
  objects:  DS.hasMany('object')
});
