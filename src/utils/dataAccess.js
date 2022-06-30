import Parse from 'parse';
import { createCopy } from '.';

export const Create = (Model, fields, obj) => {
  const user = Parse.User.current()

  const model = new Model();
  fields.forEach(field => {
    model.set(field, obj[field] || null);
  });
  model.set('createdBy', user);

  return model.save();
}

export const Read = (model, options = {}) => {
  const {
    parseJson = true,
    id = null,
    equalTo = [],
    notEqualTo = [],
    ascending = null,
    descending = null,
  } = options;

  const query = new Parse.Query(model);
  if (ascending) query.ascending(ascending);
  if (descending) query.descending(descending);
  equalTo.forEach(item => query.equalTo(item[0], item[1] || null));
  notEqualTo.forEach(item => query.notEqualTo(item[0], item[1] || null));

  return (id ? query.get(id) : query.find()).then(result =>
    parseJson === false ? result : createCopy(result),
  );
};

export const Update = (model, id, fields, obj) =>
  new Parse.Query(model).get(id).then(result => {
    const user = Parse.User.current()

    fields.forEach(field => result.set(field, obj[field] || null));
    result.set('updatedBy', user);
    return result.save();
  });

export const Delete = (model, id) =>
  new Parse.Query(model).get(id).then(result => {
    const user = Parse.User.current()
    result.set('deletedAt', new Date());
    result.set('deletedBy', user);
    return result.save();
  })
