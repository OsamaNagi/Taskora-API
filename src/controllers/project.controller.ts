import asyncHandler from 'express-async-handler';
import { projectService, statusService, tagService } from '../services';
import {
  projectSchema,
  projectUpdateSchema,
  CREATED,
  NO_CONTENT,
  OK,
  sortSchema,
  DB_COLUMNS,
  BAD_REQUEST,
  paramsSchema,
} from '../utils';
import { ISortQuery } from '../types';

export const createProject = asyncHandler(async (req, res) => {
  const schema = projectSchema.parse(req.body);
  const { statusUuid, tagUuid } = schema;

  await statusService.isStatusExists(statusUuid);

  if (tagUuid) {
    await tagService.isTagExists(tagUuid);
  }

  const project = await projectService.createOne({
    ...schema,
    userUuid: req.user?.uuid as string,
  });

  res
    .status(CREATED)
    .json({ message: 'Project created successfully!', data: project });
});

export const getProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const project = await projectService.isProjectExists(uuid);

  res
    .status(OK)
    .json({ message: 'Retrieved project successfully!', data: project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const { sortBy, order } = sortSchema.parse(req.query);
  const validColumns = Object.values(DB_COLUMNS.PROJECT);
  const sortFields = sortBy?.split(',') || [];
  const sortOrders = order?.split(',') || [];

  const invalidFields = sortFields.filter(
    (field) => !validColumns.includes(field)
  );
  if (invalidFields.length > 0) {
    res.status(BAD_REQUEST).json({
      message: `Invalid sort field(s): ${invalidFields.join(', ')}. Allowed fields: ${validColumns.join(', ')}`,
    });
    return;
  }

  const orderBy: ISortQuery = sortFields.map((field, index) => ({
    [field]: sortOrders[index]?.toLocaleLowerCase() === 'desc' ? 'desc' : 'asc',
  }));

  const projects = await projectService.findMany(
    { userUuid: req.user?.uuid as string },
    orderBy.length > 0 ? orderBy : undefined
  );

  res
    .status(OK)
    .json({ message: 'Retrieved projects successfully!', data: projects });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  const schema = projectUpdateSchema.parse(req.body);

  await projectService.isProjectExists(uuid);

  const updatedProject = await projectService.updateOne({ uuid }, schema);

  res
    .status(OK)
    .json({ message: 'Project updated successfully!', data: updatedProject });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { uuid } = paramsSchema.parse(req.params);
  await projectService.deleteProjectByUUID(uuid);

  res.sendStatus(NO_CONTENT);
});
