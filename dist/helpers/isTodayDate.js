"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayDate = void 0;
// Helper function to check if a date is today
const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return (checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear());
};
exports.todayDate = {
    isToday,
};
