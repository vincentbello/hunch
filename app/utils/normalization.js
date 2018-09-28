// @flow
import { type Entities as AllEntities } from 'types/entities';

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
export const toEntities = (entities: Array<Entity>, nestedEntityKeys: Array<string> = []): Entities => {
  const entityHash = {};

  entities.forEach((entity: Entity) => {
    const entityToPersist = { ...entity };
    nestedEntityKeys.forEach((key: string) => {
      if (typeof entity[key] === 'object') {
        entityToPersist[`${key}Id`] = entity[key].id;
        delete entityToPersist[key];
      }
    });
    entityHash[entity.id] = entityToPersist;
  });

  return entityHash;
};

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

export const getEntity = (entities: Entities, entityId: Id): Entity => entities[entityId];

export function idsToList(
  entities: Entities,
  ids: Array<Id>,
  nestedEntityKeys: { [key: string]: string } = {},
  allEntities: AllEntities = {}
): Array<Entity> {
  return ids.reduce((list: Array<Entity>, id: Id): Array<Entity> => {
    const entity = getEntity(entities, id);

    if (entity) {
      const listEntity = { ...entity };
      Object.keys(nestedEntityKeys).forEach((key: string) => {
        listEntity[key] = getEntity(allEntities[nestedEntityKeys[key]], listEntity[`${key}Id`]);
      });
      list.push(listEntity);
    }

    return list;
  }, []);
}
