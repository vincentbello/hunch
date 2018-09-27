// @flow

type Id = string | number;

type Entity = {
  id: Id,
};

type Entities = { [id: Id]: Entity };

/**
 * Normalize an array of records into a list of IDs
 */
export const toList = (entities: Array<Entity>): Array<Id> => entities.map((entity: Entity): Id => entity.id);

/**
 * Normalize an array of records into a hash of IDs
 */
export const toEntities = (entities: Array<Entity>): { [id: Id]: Entity } => {
  const entityHash = {};

  entities.forEach((entity: Entity) => {
    entityHash[entity.id] = entity;
  });

  return entityHash;
};

export const getEntity = (entities: Entities, entityId: Id): Entity => entities[entityId];

export function idsToList(entities: Entities, ids: Array<Id>): Array<Entity> {
  return ids.reduce((list: Array<Entity>, id: Id): Array<Entity> => {
    const entity = getEntity(entities, id);
    if (entity) list.push(entity);
    return list;
  }, []);
}
