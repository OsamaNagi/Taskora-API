import asyncHandler from 'express-async-handler';
import {
  ApiError,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  paramsSchema,
  updateUserSchema,
} from '../utils';
import { HashingService, userService, cloudinaryService } from '../services';
import { IUser } from '../interfaces';

export const getUser = asyncHandler(async (req, res, next) => {
  const uuid = req.user?.uuid as string;

  const isUserExists = (await userService.findUserByUUID(uuid)) as IUser;

  if (!isUserExists) {
    return next(new ApiError('User not found', NOT_FOUND));
  }

  const user: IUser = {
    uuid: isUserExists.uuid,
    name: isUserExists.name,
    email: isUserExists.email,
    picture: isUserExists.picture,
  };

  res.json({ message: 'User retrieved successfully!', data: user });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const userUUID = req.user?.uuid as string;
  const { uuid } = paramsSchema.parse(req.params);

  if (userUUID !== uuid) {
    return next(
      new ApiError(`You are not allowed to access this resource`, FORBIDDEN)
    );
  }

  const user = await userService.findUserByUUID(userUUID);
  if (!user) {
    return next(new ApiError('User not found', NOT_FOUND));
  }

  let picture = user.picture;
  if (req.file) {
    const { image } = await cloudinaryService.uploadImage(req.file.path);
    picture = image;
  }

  const { name, password } = updateUserSchema.parse({ ...req.body, picture });

  if (name) user.name = name;
  if (password) user.password = await HashingService.hash(password);

  await userService.updateOne(
    { uuid: userUUID },
    { name: user.name, password: user.password, picture }
  );

  res.status(OK).json({ message: 'User updated successfully!' });
});
