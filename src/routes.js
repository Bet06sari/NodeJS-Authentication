"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_controller_1 = require("./controller/auth.controller");
const forgot_controller_1 = require("./controller/forgot.controller");
const routes = (router) => {
  router.post("/api/register", auth_controller_1.Register);
  router.post("/api/login", auth_controller_1.Login);
  router.get("/api/user", auth_controller_1.AuthenticatedUser);
  router.post("/api/refresh", auth_controller_1.Refresh);
  router.post("/api/logout", auth_controller_1.Logout);
  router.post("/api/forgot", forgot_controller_1.ForgotPassword);
  router.post("/api/reset", forgot_controller_1.ResetPassword);
};
exports.routes = routes;
