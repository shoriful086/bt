"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const deposit_service_1 = require("./deposit.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const deposit_constant_1 = require("./deposit.constant");
const insertInToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.insertInToDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deposit request successful",
        data: result,
    });
}));
const getAllDepositData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, deposit_constant_1.depositFilterableField);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = yield deposit_service_1.depositService.getAllDepositData(user, filter, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All deposit data fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getPendingDeposit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.getPendingDeposit(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get pending deposit fetched",
        data: result,
    });
}));
const getSuccessDeposit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.getSuccessDeposit(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get success deposit data fetched",
        data: result,
    });
}));
const getRejectedDeposit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.getRejectedDeposit(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get rejected deposit data fetched",
        data: result,
    });
}));
const updateDepositStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { depositId } = req.params;
    const user = req.user;
    const result = yield deposit_service_1.depositService.updateDepositStatus(user, depositId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deposit ${result.depositStatus}`,
        data: result,
    });
}));
const depositBonus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.depositBonus(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deposit bonus created`,
        data: result,
    });
}));
const getBonusData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield deposit_service_1.depositService.getBonusData(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deposit bonus fetched!`,
        data: result,
    });
}));
const deleteBonusData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield deposit_service_1.depositService.deleteBonusData(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Deposit bonus deleted!`,
        data: result,
    });
}));
exports.depositController = {
    insertInToDB,
    getAllDepositData,
    getPendingDeposit,
    getSuccessDeposit,
    getRejectedDeposit,
    updateDepositStatus,
    depositBonus,
    getBonusData,
    deleteBonusData,
};
