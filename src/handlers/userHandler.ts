import { verifyUser } from "../middleware";
import { verifyGoogleToken } from '../middleware'
import { IPayload, IUser, IuserAccountDetails } from "../services/userService";
import { Context, NotFoundError } from "@zode/zode";

import {
  createUser,
  getAccountInvites,
  getLinkedAccountOfUsers,
  getUserByEmailId,

} from "../services/userService";

export const userLoginHandler = async (ctx: Context) => {
  const userToken = ctx.state.headers["x-authenticated-token"];
  const payLoad: any = await verifyGoogleToken(ctx, userToken);
  const userDetails: IUser = await getUserByEmailId(payLoad.email, ctx).catch(async (err) => {
    if (err instanceof NotFoundError) {
      const userData = await createUser(payLoad, ctx);
      return userData;
    }
    throw err;
  });
  const userAccountDetails: IuserAccountDetails = await getLinkedAccountOfUsers(userDetails.id, ctx);
  userDetails.userAccountDetails = userAccountDetails;
  return userDetails;
}
export const accounInvitesHandler = async (ctx: Context) => {
  await verifyUser(ctx);
  const userDetails = ctx.state.userDetails;
  return getAccountInvites(userDetails.emailId, ctx);
};

