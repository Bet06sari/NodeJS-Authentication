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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Refresh = exports.AuthenticatedUser = exports.Login = exports.Register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_entity_1 = require("../entity/user.entity");
const jsonwebtoken_1 = require("jsonwebtoken");
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, password: plainPassword } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, 12);
        const newUser = new user_entity_1.User({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        // Kullanıcıyı veritabanına kaydetme
        yield newUser.save();
        const _a = newUser.toObject(), { password } = _a, data = __rest(_a, ["password"]);
        res.status(201).send(data);
    }
    catch (error) {
        console.error("Kullanıcı oluşturulurken hata:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_entity_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                message: "Kullanıcı bulunamadı"
            });
        }
        if (!user.password) {
            return res.status(400).json({
                message: "Kullanıcı şifresi bulunamadı"
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Şifre hatalı"
            });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({
            id: user.id
        }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });
        const refreshToken = (0, jsonwebtoken_1.sign)({
            id: user.id
        }, process.env.REFRESH_SECRET || '', { expiresIn: '1w' });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.send({
            message: 'success'
        });
    }
    catch (error) {
        console.error("Kullanıcı girişi yapılırken hata:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});
exports.Login = Login;
const AuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies['access_token'];
        const payload = (0, jsonwebtoken_1.verify)(cookie, process.env.ACCESS_SECRET || '');
        if (!payload) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const user = yield user_entity_1.User.findOne({ _id: payload.id });
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const _b = user.toObject(), { password } = _b, data = __rest(_b, ["password"]); //mongoose modelini js nesnesine dönüştürme
        res.send(data);
    }
    catch (e) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
});
exports.AuthenticatedUser = AuthenticatedUser;
const Refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies['refresh_token'];
        const payload = (0, jsonwebtoken_1.verify)(cookie, process.env.REFRESH_SECRET || '');
        if (!payload) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const accessToken = (0, jsonwebtoken_1.sign)({
            id: payload.id
        }, process.env.ACCESS_SECRET || '', { expiresIn: '30s' });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.send({
            message: 'Success'
        });
    }
    catch (e) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    ;
});
exports.Refresh = Refresh;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('access_token', '', { maxAge: 0 });
    res.cookie('refresh_token', '', { maxAge: 0 });
    res.send({
        message: 'Success'
    });
});
exports.Logout = Logout;
