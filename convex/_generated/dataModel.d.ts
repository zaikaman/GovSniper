/* eslint-disable */
import type { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

export type DataModel = AnyDataModel;
export type Id<TableName extends string> = GenericId<TableName>;
export type Doc<TableName extends string> = any;
