import { AppUserRoutes } from "../AppUser/appUser.route";
import { AuthRoutes } from "../Auth/auth.route";
import { DepositRoutes } from "../Deposit/deposit.route";
import { PaymentMethodRoutes } from "../PaymentMethod/paymentMethod.route";
import { ReferCommissionRoutes } from "../ReferCommission/referCommission.route";
import { SignUpBonusRoutes } from "../SignUpBonus/signUpBonus.route";
import { UserRoutes } from "../User/user.route";
import express from "express";
import { WithdrawRoutes } from "../Withdraw/withdraw.route";
import { PackageRoutes } from "../Package/package.route";
import { BuyPackageRoutes } from "../BuyPackage/buyPackage.route";
import { CompleteTaskRoutes } from "../CompleteTask/completeTask.route";
import { WithdrawMethodRoutes } from "../WithdrawMethod/withdrawMethod.route";
export const router = express.Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/app-user",
    route: AppUserRoutes,
  },
  {
    path: "/signup-bonus",
    route: SignUpBonusRoutes,
  },
  {
    path: "/payment-method",
    route: PaymentMethodRoutes,
  },
  {
    path: "/withdraw-method",
    route: WithdrawMethodRoutes,
  },
  {
    path: "/deposit",
    route: DepositRoutes,
  },
  {
    path: "/withdraw",
    route: WithdrawRoutes,
  },
  {
    path: "/refer-commission",
    route: ReferCommissionRoutes,
  },
  {
    path: "/package",
    route: PackageRoutes,
  },
  {
    path: "/buy-package",
    route: BuyPackageRoutes,
  },
  {
    path: "/complete-task",
    route: CompleteTaskRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));
