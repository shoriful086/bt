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
exports.withdrawMethodController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const withdrawMethod_service_1 = require("./withdrawMethod.service");
const insertInToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const file = req.file;
    const result = yield withdrawMethod_service_1.withdrawMethodService.insertInToDB(user, file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ` Withdraw method ${result.name} created`,
        data: result,
    });
}));
const getAllWithdrawMethod = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield withdrawMethod_service_1.withdrawMethodService.getAllWithdrawMethod(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdraw method fetched successfully",
        data: result,
    });
}));
const deleteWithdrawMethod = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { withdrawId } = req.params;
    const user = req.user;
    const result = yield withdrawMethod_service_1.withdrawMethodService.deleteWithdrawMethod(user, withdrawId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Withdraw method deleted!",
        data: result,
    });
}));
exports.withdrawMethodController = {
    insertInToDB,
    getAllWithdrawMethod,
    deleteWithdrawMethod,
};
