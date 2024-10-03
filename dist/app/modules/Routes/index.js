"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const appUser_route_1 = require("../AppUser/appUser.route");
const auth_route_1 = require("../Auth/auth.route");
const deposit_route_1 = require("../Deposit/deposit.route");
const paymentMethod_route_1 = require("../PaymentMethod/paymentMethod.route");
const referCommission_route_1 = require("../ReferCommission/referCommission.route");
const signUpBonus_route_1 = require("../SignUpBonus/signUpBonus.route");
const user_route_1 = require("../User/user.route");
const withdraw_route_1 = require("../Withdraw/withdraw.route");
const package_route_1 = require("../Package/package.route");
const buyPackage_route_1 = require("../BuyPackage/buyPackage.route");
const completeTask_route_1 = require("../CompleteTask/completeTask.route");
const withdrawMethod_route_1 = require("../WithdrawMethod/withdrawMethod.route");
const meta_route_1 = require("../Meta/meta.route");
const ads_route_1 = require("../Ads/ads.route");
const banner_route_1 = require("../Banner/banner.route");
const paymentRoute_1 = require("../PaymentNotice/paymentRoute");
const bet_route_1 = require("../Bet/bet.route");
const spin_route_1 = require("../LuckySpin/spin.route");
const admin_route_1 = require("../Admin/admin.route");
const referBonus_route_1 = require("../ReferBonus/referBonus.route");
const multiply_route_1 = require("../LuckySpinMultiply/multiply.route");
const notice_route_1 = require("../Notice/notice.route");
const targetReferBonus_route_1 = require("../TargetReferBonus/targetReferBonus.route");
exports.router = express_1.default.Router();
const modulesRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/app-user",
        route: appUser_route_1.AppUserRoutes,
    },
    {
        path: "/signup-bonus",
        route: signUpBonus_route_1.SignUpBonusRoutes,
    },
    {
        path: "/payment-method",
        route: paymentMethod_route_1.PaymentMethodRoutes,
    },
    {
        path: "/withdraw-method",
        route: withdrawMethod_route_1.WithdrawMethodRoutes,
    },
    {
        path: "/deposit",
        route: deposit_route_1.DepositRoutes,
    },
    {
        path: "/withdraw",
        route: withdraw_route_1.WithdrawRoutes,
    },
    {
        path: "/payment-notice",
        route: paymentRoute_1.PaymentNoticeRoutes,
    },
    {
        path: "/refer-commission",
        route: referCommission_route_1.ReferCommissionRoutes,
    },
    {
        path: "/packages",
        route: package_route_1.PackageRoutes,
    },
    {
        path: "/buy-package",
        route: buyPackage_route_1.BuyPackageRoutes,
    },
    {
        path: "/complete-task",
        route: completeTask_route_1.CompleteTaskRoutes,
    },
    {
        path: "/ads",
        route: ads_route_1.AdsRoutes,
    },
    {
        path: "/banner",
        route: banner_route_1.BannerRoutes,
    },
    {
        path: "/meta",
        route: meta_route_1.MetaDataRoutes,
    },
    {
        path: "/bet",
        route: bet_route_1.BetRoutes,
    },
    {
        path: "/spin",
        route: spin_route_1.SpinRoutes,
    },
    {
        path: "/refer-bonus",
        route: referBonus_route_1.ReferBonusRoutes,
    },
    {
        path: "/spin-multiply",
        route: multiply_route_1.MultiplyRoutes,
    },
    {
        path: "/notice",
        route: notice_route_1.NoticeRoutes,
    },
    {
        path: "/target-refer",
        route: targetReferBonus_route_1.TargetReferBonusRoute,
    },
];
modulesRoutes.forEach((route) => exports.router.use(route.path, route.route));
