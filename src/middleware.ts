import { Context, UnauthorizedError } from "@zode/zode";
import { OAuth2Client } from "google-auth-library";
import { getUserByEmailId, IUser } from "./services/userService";
import { IPayload } from "./services/userService";

export const verifyGoogleToken = async (ctx: Context, userToken: string) => {
  const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);
    const payload = await client.verifyIdToken({
      idToken: userToken,
      audience: CLIENT_ID_GOOGLE,
    });
    const userPayload = await payload.getPayload();
    return userPayload;
  } catch (error) {
    throw new UnauthorizedError();
  }
};

export const verifyUser = async (ctx: Context) => {
  const userToken = ctx.state.headers["x-authenticated-token"];
  const payLoad: any = await verifyGoogleToken(ctx, userToken);
  const userDetails: IUser = await getUserByEmailId(payLoad.email, ctx).catch((error) => {
    if (error.status === 404) {
      throw new UnauthorizedError();
    }
    throw error;
  });
  ctx.state.logedInUserId = userDetails.id
  ctx.state.userDetails = userDetails;
};