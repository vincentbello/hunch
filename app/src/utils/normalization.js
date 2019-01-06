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

/** Normalize a single record */
export const parseEntity = (entity: Entity, nestedEntityKeys: Array<string> = []): Entity =>
  nestedEntityKeys.reduce((parsedEntity: Entity, key: string): Entity => {
    if (typeof parsedEntity[key] === 'object') {
      parsedEntity[`${key}Id`] = parsedEntity[key].id;
      delete parsedEntity[key];
    }
    return parsedEntity;
  }, { ...entity });

/**
 * Normalize an array of records into a hash of IDs
 */
export const toEntities = (entities: Array<Entity>, nestedEntityKeys: Array<string> = []): Entities =>
  entities.reduce((entitiesHash: Entities, entity: Entity): Entities => {
    entitiesHash[entity.id] = parseEntity(entity, nestedEntityKeys);
    return entitiesHash;
  }, {});

export const toNestedEntities = (entities: Array<Entity> | Entity, nestedEntityKeys: Array<string> = []): Entities => {
  if (Array.isArray(entities)) {
    return entities.reduce((acc: Entities, entity: Entity): Entities => {
      nestedEntityKeys.forEach((key: string) => {
        if (typeof entity[key] === 'object') acc[entity[key].id] = entity[key];
      });

      return acc;
    }, {});
  }

  const entityHash = {};
  nestedEntityKeys.forEach((key: string) => {
    if (typeof entities[key] === 'object') entityHash[entities[key].id] = entities[key];
  });
  return entityHash;
};

export const getEntity = (
  entities: Entities,
  entityId: Id,
  nestedEntityKeys: { [key: string]: string } = {},
  allEntities: AllEntities = {}
): Entity => {
  const entity = entities[entityId];
  if (!entity) return entity;

  return Object.keys(nestedEntityKeys).reduce((fullEntity: Entity, key: string): Entity => {
    fullEntity[key] = allEntities[nestedEntityKeys[key]][fullEntity[`${key}Id`]];
    return fullEntity;
  }, { ...entity });
}

export function idsToList(
  entities: Entities,
  ids: Array<Id>,
  nestedEntityKeys: { [key: string]: string } = {},
  allEntities: AllEntities = {}
): Array<Entity> {
  return ids.reduce((list: Array<Entity>, id: Id): Array<Entity> => {
    const entity = getEntity(entities, id, nestedEntityKeys, allEntities);
    if (entity) list.push(entity);
    return list;
  }, []);
}
