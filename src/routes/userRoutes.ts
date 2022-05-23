import IZode from "@zode/zode";
import {
  accounInvitesHandler,
  userLoginHandler,
} from "../handlers/userHandler";
export default async (app: IZode) => {
  app.post("/user/login", userLoginHandler);
  app.get("/user/invites", accounInvitesHandler);
};
