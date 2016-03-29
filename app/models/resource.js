import DS from 'ember-data';

export default DS.Model.extend({
  title:               DS.attr('string'),
  createdDate:         DS.attr('date'),
  dateTime:            DS.attr('date'),
  numberOfRevisions:   DS.attr('number')
});
