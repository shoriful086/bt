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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error("You're not authorized");
            }
            const verifyUser = jsonwebtoken_1.default.verify(token, "cfbkyUS57Bge");
            req.user = verifyUser;
            console.log(verifyUser);
            if ((roles === null || roles === void 0 ? void 0 : roles.length) && !roles.includes(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.role)) {
                throw new Error("Forbidden");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.auth = auth;
