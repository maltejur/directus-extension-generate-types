import { defineHook } from '@directus/extensions-sdk';
import generateTsTypes from "../lib/generate-types/ts";
import { ActionHandler, Collection, Field, Relation, SchemaOverview } from "@directus/types";
import { Collections } from '../lib/types';
import { gatherCollectionsData } from '../lib/generate-types/utils';
import * as fs from 'node:fs';

export default defineHook(({ action }, extCtx) => {
  const { services: { CollectionsService, FieldsService, RelationsService }, env, logger } = extCtx;

  let targetFiles: string | string[] = env.GENERATE_TYPES_SYNCED_TS_FILES;

  if (targetFiles == null || targetFiles.length === 0) {
    logger.info('No target file defined to automatically sync TypeScript types')
    return
  }

  if (! Array.isArray(targetFiles)) {
    targetFiles = [targetFiles]
  }

  const listCollections = async (schema: SchemaOverview) => {
		const collectionsService = new CollectionsService({schema});
		const collections: Collection[] = await collectionsService.readByQuery();

		const fieldsService = new FieldsService({schema});
		const fields: Field[] = await fieldsService.readAll();

		const relationsService = new RelationsService({schema});
		const relations: Relation[] = await relationsService.readAll();

    const collectionsData: Collections = await gatherCollectionsData(
      collections,
      fields,
      relations
    )

    let useIntersectionTypes = false;
    generateTsTypes(collectionsData, useIntersectionTypes).then((types) => {
      targetFiles.forEach((targetFile: string) => {
        writeToFile('./', targetFile, types)
        logger.info(`Types synced into ${targetFile}`)
      })
    });
  }

  const onChange: ActionHandler = async ({ }, { schema }) => {
    if (schema === null) {
      throw new Error('schema is null');
    }
    listCollections(schema);
  }

	action('collections.create', onChange);
  action('collections.update', onChange);
	action('collections.delete', onChange);

  action('fields.create', onChange);
	action('fields.update', onChange);
	action('fields.delete', onChange);

  action('relations.create', onChange);
	action('relations.update', onChange);
	action('relations.delete', onChange);
});


export function writeToFile(directoryPath: string, fileName: string, data: string) {
  try {
    fs.mkdirSync(directoryPath, {recursive: true})
  }
  catch (e: any) {
    if (e.code != `EEXIST`) {
      throw e
    }
  }

  fs.writeFileSync(`${directoryPath}/${fileName}`, data)
}
