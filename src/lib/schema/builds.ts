import { build } from "$service-worker";
import * as v from "valibot";

const buildTypeEnum = v.picklist(["homepage", "category", "landing_page", "custom"]);

export const createBuildSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required"), v.maxLength(255)),
  buildType: buildTypeEnum,
  content: v.optional(v.record(v.string(), v.unknown()), {}),
  thumbnailUrl: v.pipe(v.string(), v.url("Must be a valid URL"))
});

export const updateBuildSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(255))),
	buildType: v.optional(buildTypeEnum),
	content: v.optional(v.record(v.string(), v.unknown())),
	thumbnailUrl: v.optional(v.pipe(v.string(), v.url()))
})

export const createTemplateSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, "Name is required"), v.maxLength(255)),
	description: v.optional(v.pipe(v.string(), v.maxLength(500))),
	buildType: buildTypeEnum,
	content: v.record(v.string(), v.unknown()),
	thumbnailUrl: v.pipe(v.string(), v.url("Must be a valid URL"))
})

export const updateTemplateSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(255))),
	description: v.optional(v.pipe(v.string(), v.maxLength(500))),
	buildType: v.optional(buildTypeEnum),
	content: v.optional(v.record(v.string(), v.unknown())),
	thumbnailUrl: v.optional(v.pipe(v.string(), v.url()))
})