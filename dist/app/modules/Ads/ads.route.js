"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const ads_controller_1 = require("./ads.controller");
const ads_validation_1 = require("./ads.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER, client_1.UserRole.APP_USER), ads_controller_1.adsController.getAllAdsFromDB);
router.post("/create", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), (req, res, next) => {
    req.body = ads_validation_1.adsValidation.createAd.parse(req.body);
    return ads_controller_1.adsController.insertIntoDB(req, res, next);
});
router.delete("/:adsId", (0, auth_1.auth)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DEVELOPER), ads_controller_1.adsController.deleteAds);
exports.AdsRoutes = router;
