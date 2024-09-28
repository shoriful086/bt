import express from "express";

import { AppUserRoutes } from "../AppUser/appUser.route";
import { AuthRoutes } from "../Auth/auth.route";
import { DepositRoutes } from "../Deposit/deposit.route";
import { PaymentMethodRoutes } from "../PaymentMethod/paymentMethod.route";
import { ReferCommissionRoutes } from "../ReferCommission/referCommission.route";
import { SignUpBonusRoutes } from "../SignUpBonus/signUpBonus.route";
import { UserRoutes } from "../User/user.route";

import { WithdrawRoutes } from "../Withdraw/withdraw.route";
import { PackageRoutes } from "../Package/package.route";
import { BuyPackageRoutes } from "../BuyPackage/buyPackage.route";
import { CompleteTaskRoutes } from "../CompleteTask/completeTask.route";
import { WithdrawMethodRoutes } from "../WithdrawMethod/withdrawMethod.route";
import { MetaDataRoutes } from "../Meta/meta.route";
import { AdsRoutes } from "../Ads/ads.route";
import { BannerRoutes } from "../Banner/banner.route";
import { PaymentNoticeRoutes } from "../PaymentNotice/paymentRoute";
import { BetRoutes } from "../Bet/bet.route";
import { SpinRoutes } from "../LuckySpin/spin.route";
import { AdminRoutes } from "../Admin/admin.route";
import { ReferBonusRoutes } from "../ReferBonus/referBonus.route";
import { MultiplyRoutes } from "../LuckySpinMultiply/multiply.route";
import { NoticeRoutes } from "../Notice/notice.route";
import { TargetReferBonusRoute } from "../TargetReferBonus/targetReferBonus.route";
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
    path: "/admin",
    route: AdminRoutes,
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
    path: "/payment-notice",
    route: PaymentNoticeRoutes,
  },
  {
    path: "/refer-commission",
    route: ReferCommissionRoutes,
  },
  {
    path: "/packages",
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
  {
    path: "/ads",
    route: AdsRoutes,
  },
  {
    path: "/banner",
    route: BannerRoutes,
  },
  {
    path: "/meta",
    route: MetaDataRoutes,
  },
  {
    path: "/bet",
    route: BetRoutes,
  },
  {
    path: "/spin",
    route: SpinRoutes,
  },
  {
    path: "/refer-bonus",
    route: ReferBonusRoutes,
  },
  {
    path: "/spin-multiply",
    route: MultiplyRoutes,
  },
  {
    path: "/notice",
    route: NoticeRoutes,
  },
  {
    path: "/target-refer",
    route: TargetReferBonusRoute,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));
