import IZode, { Context, NotFoundError } from "@zode/zode";
import { v4 as uuidv4 } from "uuid";
export interface IUser {
  id: string;
  name: string;
  emailId: string;
  avatar: string;
  userAccountDetails:any;
}
export interface IuserAccountDetails {
  id: string;
  accountId: string;
  createdOn: string;
  updatedOn: string;
  invitedBy: string;
}
export interface IPayload {
  name: string;
  email: string;
  picture: string;
}
export const getUserByEmailId = async (emailId: string, ctx: Context): Promise<IUser> => {
  const res = await ctx.database?.rawQuery(
    "SELECT * FROM users where emailId = ?",
    [emailId]
  );
  if (!res[0][0]) throw new NotFoundError();
  ctx.state.loggedInUserId = res[0][0].id;
  return res[0][0];
};

export const createUser = async (userPayload: IPayload, ctx: Context): Promise<IUser> => {
  const user: IUser = {
    id: uuidv4(),
    name: userPayload.name,
    emailId: userPayload.email,
    avatar: userPayload.picture,
    userAccountDetails:null,
  };
  const res = await ctx.database?.rawQuery(
    `INSERT INTO users ( id,name,emailId,image,createdOn,updatedOn) VALUES (?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
    [
      user.id,
      user.name,
      user.emailId,
      user.avatar,
    ]
  );
  return user;
};

export const getAccountInvites = async (emailId: string, ctx: Context) => {
  const res = await ctx.database?.rawQuery(
    "SELECT * FROM accountInvites where emailId =?",
    [emailId]
  );
  return res[0];
};
export const getLinkedAccountOfUsers = async (id: string, ctx: Context) => {
  const res = await ctx.database?.rawQuery(
    "SELECT * FROM accountUsers where id = ?",
    [id]
  );
  return res[0];
};

