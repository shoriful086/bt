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
exports.paymentMethodController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const paymentMethod_service_1 = require("./paymentMethod.service");
const createMethod = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield paymentMethod_service_1.paymentMethodService.createMethod(user, req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Payment method ${result === null || result === void 0 ? void 0 : result.name} created`,
        data: result,
    });
}));
const getAllPaymentMethod = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield paymentMethod_service_1.paymentMethodService.getAllPaymentMethod(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment method fetched successfully",
        data: result,
    });
}));
const deletePaymentMethod = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId } = req.params;
    const user = req.user;
    const result = yield paymentMethod_service_1.paymentMethodService.deletePaymentMethod(user, paymentMethodId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment method deleted!",
        data: result,
    });
}));
const createPrivateNumber = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield paymentMethod_service_1.paymentMethodService.createPrivateNumber(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment method Created!",
        data: result,
    });
}));
const getPrivateNumber = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield paymentMethod_service_1.paymentMethodService.getPrivateNumber(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment method get success!",
        data: result,
    });
}));
const deletePrivateNumber = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    console.log(id);
    const result = yield paymentMethod_service_1.paymentMethodService.deletePrivateNumber(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Number deleted!",
        data: result,
    });
}));
const updatePrivateNumberCount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield paymentMethod_service_1.paymentMethodService.updatePrivateNumberCount(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment method update success!",
        data: result,
    });
}));
exports.paymentMethodController = {
    createMethod,
    getAllPaymentMethod,
    deletePaymentMethod,
    createPrivateNumber,
    getPrivateNumber,
    updatePrivateNumberCount,
    deletePrivateNumber,
};
