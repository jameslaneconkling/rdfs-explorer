import DS from 'ember-data';

export default DS.Model.extend({
  title:               DS.attr('string'),
  createdDate:         DS.attr(),
  dateTime:            DS.attr(),
  numberOfRevisions:   DS.attr('number'),
  communityTags:       DS.attr(),
  cannotDisplay:       DS.attr('boolean'),
  predicates:          DS.hasMany('predicate') // necessary?  how are embedded models that are added to the includes array in the resource serializer normalized?
});
