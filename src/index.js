"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var body_parser_1 = require("body-parser");
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var User_1 = require("./entities/User");
var Chart_1 = require("./entities/Chart");
var DataSource_1 = require("./entities/DataSource");
var cors = require("cors");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var passportLocal = require("passport-local");
var path = require("path");
var fs = require("fs");
var multer = require("multer");
/*                            CONSTANTS DEFINITIONS                           */
var PORT = 5000; // Porta em que o servidor escuta.
var ROOT_DIR = path.resolve(__dirname + "/../"); // A raiz do servidor.
var AVATAR_STORAGE = "/asset/avatar/"; // O diretório dos avatares.
;
var InvalidOperation = /** @class */ (function () {
    function InvalidOperation() {
        this.code = 100;
        this.message = "Invalid Operation. Try Again.";
    }
    return InvalidOperation;
}());
;
var NonExistentUser = /** @class */ (function () {
    function NonExistentUser() {
        this.code = 200;
        this.message = "User don't exists.";
    }
    return NonExistentUser;
}());
;
var NonExistentDataSourceIDs = /** @class */ (function () {
    function NonExistentDataSourceIDs() {
        this.code = 400;
        this.message = "Some Data Source IDs don't exits.";
    }
    return NonExistentDataSourceIDs;
}());
/* ────────────────────────────────────────────────────────────────────────── */
typeorm_1.createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "code",
    password: "password",
    database: "test",
    entities: [
        User_1.User,
        Chart_1.Chart,
        DataSource_1.DataSource,
    ],
    synchronize: true,
})
    .then(function (connection) { return __awaiter(_this, void 0, void 0, function () {
    var app, upload, usersRepository, dataSourcesRepository, chartsRepository, getUser, convertToDataSource;
    var _this = this;
    return __generator(this, function (_a) {
        app = express();
        app.use(express.static(ROOT_DIR + "/build/"));
        app.use(express.static(ROOT_DIR + "/public/"));
        // A API e as rotas do FRONT-END são divididas em domínios específicos.
        // As rotas da API possuem o prefixo "/api/*" e as demais rotas são rotas
        // do browser apenas.
        // Portanto, se a rota inicia-se com "/api/*" ele seque as demais rotas de-
        // finidas no App. Caso contrário, é servida com o arquivo "index.html" para
        // que o Single Page Application (SPA) do React funcione apropriadamente.
        // // app.get("/api/*", (_, __, next) => {
        //        // next("route");
        //// });
        //// app.get(["/login", "/home", "/chart", "/datadource"],
        app.get("*", function (req, res, next) {
            if (req.url.startsWith("/api/"))
                next("route");
            else
                next();
        }, function (_req, res) {
            res.sendFile(ROOT_DIR + "/build/index.html");
        });
        // Para fins de teste.
        app.use(cors({
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
            origin: true,
        }));
        app.use(body_parser_1.json());
        upload = multer({
            dest: path.resolve(ROOT_DIR + "/public" + AVATAR_STORAGE)
        });
        usersRepository = connection.getRepository(User_1.User);
        dataSourcesRepository = connection.getRepository(DataSource_1.DataSource);
        chartsRepository = connection.getRepository(Chart_1.Chart);
        getUser = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var uid, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid = parseInt(id);
                        return [4 /*yield*/, usersRepository.findOne(uid)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new NonExistentUser();
                        return [2 /*return*/, user];
                }
            });
        }); };
        convertToDataSource = function (ids, owner) { return __awaiter(_this, void 0, void 0, function () {
            var dataSources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataSourcesRepository.findByIds(ids, {
                            where: { owner: owner }
                        })];
                    case 1:
                        dataSources = _a.sent();
                        if (dataSources.length !== ids.length)
                            throw new NonExistentDataSourceIDs();
                        return [2 /*return*/, dataSources];
                }
            });
        }); };
        /*                             API - AUTENTICAÇÃO                             */
        passport.serializeUser(function (user, done) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                done(null, user.id);
                return [2 /*return*/];
            });
        }); });
        passport.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usersRepository.findOne(id)];
                    case 1:
                        user = _a.sent();
                        done(null, user);
                        return [2 /*return*/];
                }
            });
        }); });
        app.use(cookieParser("sensorize"));
        app.use(session({
            secret: "sensorize",
            resave: false,
            saveUninitialized: false,
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new passportLocal.Strategy({
            usernameField: "email",
            passwordField: "password",
        }, function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usersRepository.findOne({
                            where: { email: email, password: password, }
                        })];
                    case 1:
                        user = _a.sent();
                        if (user)
                            done(null, user, { message: "Success!" });
                        else
                            done(null, false, { message: "Fail!" });
                        return [2 /*return*/];
                }
            });
        }); }));
        /* app.post("/api/login", passport.authenticate("local", {
            successRedirect: "/home",
            failureRedirect: "/login",
            failureFlash: true,
        })); */
        app.post("/api/login", function (req, res, next) {
            passport.authenticate("local", function (error, user, info) {
                console.log("User logged: " + JSON.stringify(user));
                if (error || !user) {
                    next(error);
                }
                else {
                    req.logIn(user, function (error) {
                        if (error)
                            next(error);
                        return res.sendStatus(200);
                    });
                }
            })(req, res, next);
        });
        app.get("/api/logout", function (req, res, next) {
            req.logOut();
            res.sendStatus(200);
            next();
        });
        /*                                STATIC FILES                                */
        // Utilizado para exibir os avatar dos usuários.
        // app.use(express.static(AVATAR_STORAGE));
        /*                                API - USUÁRIO                               */
        app
            .route("/api/users")
            .post(upload.single("avatar"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_1, userErrors, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user_1 = new User_1.User();
                        user_1 = usersRepository.merge(user_1, req.body);
                        // Apenas o link do avatar é posto aqui.
                        user_1.avatar = AVATAR_STORAGE + req.file.filename;
                        return [4 /*yield*/, class_validator_1.validate(user_1)];
                    case 1:
                        userErrors = _a.sent();
                        // Retorna os dados cadastrado caso não haja erros. Se houver erros,
                        // retorne os erros de validação.
                        if (userErrors.length > 0) {
                            // Remove o avatar caso ocorra algum erro no cadastro. Evita o
                            // acumulo de arquivos inuteis no servidor.
                            fs.unlink(ROOT_DIR + "/public" + user_1.avatar, function (error) {
                                if (error)
                                    throw error;
                                console.log("trash removed: " + user_1.avatar);
                            });
                            throw userErrors.map(function (error) { return error.constraints; });
                        }
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.insert(User_1.User, user_1)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 2:
                        _a.sent();
                        // Não reenvie a senha.
                        delete user_1.password;
                        res.status(200).json(user_1);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        next(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        /*                                 SECURE ZONE                                */
        app.use(function (req, res, next) {
            if (req.user == undefined) {
                if (!res.headersSent)
                    res.sendStatus(401);
            }
            else {
                next();
            }
        });
        app
            .route("/api/users")
            .put(upload.single("avatar"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var loggedUser_1, AVATAR_PATH, userError, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loggedUser_1 = req.user;
                        if (req.file != null) {
                            AVATAR_PATH = ROOT_DIR + "/public" + AVATAR_STORAGE;
                            // Deleta o avatar antigo.
                            fs.exists(AVATAR_STORAGE + loggedUser_1.avatar, (function (exists) {
                                if (!exists)
                                    return;
                                fs.unlink(loggedUser_1.avatar, function (error) {
                                    console.log(error);
                                    throw error;
                                });
                            }));
                            loggedUser_1.avatar = AVATAR_STORAGE + req.file.filename;
                        }
                        loggedUser_1 = usersRepository.merge(loggedUser_1, req.body);
                        return [4 /*yield*/, class_validator_1.validate(loggedUser_1)];
                    case 1:
                        userError = _a.sent();
                        if (userError.length > 0)
                            throw userError.map(function (error) { return error.constraints; });
                        return [4 /*yield*/, connection.transaction(function (trasaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trasaction.update(User_1.User, loggedUser_1.id, loggedUser_1)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 2:
                        _a.sent();
                        delete loggedUser_1.password; // Não reenvia a senha.
                        res.status(200).json(loggedUser_1);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        next(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var loggedUser;
            return __generator(this, function (_a) {
                try {
                    loggedUser = req.user;
                    delete loggedUser.password; // Não reenvia a senha.
                    if (loggedUser)
                        res.status(200).json(loggedUser);
                    else
                        res.sendStatus(400);
                }
                catch (error) {
                    next(error);
                }
                return [2 /*return*/];
            });
        }); });
        app
            .route("/api/users/:id")
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getUser(req.params.id)];
                    case 1:
                        user = _a.sent();
                        delete user.password;
                        res.json(user);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        next(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })
            .put(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var uid_1, user, userErrors, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        uid_1 = parseInt(req.params.id);
                        return [4 /*yield*/, usersRepository.findOne(uid_1)];
                    case 1:
                        user = _a.sent();
                        user = usersRepository.merge(user, req.body);
                        return [4 /*yield*/, class_validator_1.validate(user)];
                    case 2:
                        userErrors = _a.sent();
                        // Responde baseado se há erros ou não.
                        if (userErrors.length === 0) {
                            connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // O body é validado com todo objeto apenas para fins de
                                        // validação, porém apenas a parte contida no body é
                                        // utilizada para a modificação.
                                        return [4 /*yield*/, transaction.update(User_1.User, uid_1, req.body)];
                                        case 1:
                                            // O body é validado com todo objeto apenas para fins de
                                            // validação, porém apenas a parte contida no body é
                                            // utilizada para a modificação.
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            // Não retorne a senha.
                            delete user.password;
                            // Retorna os dados do usuário após a modificação.
                            res.status(200).json(user);
                        }
                        else {
                            throw userErrors.map(function (error) { return error.constraints; });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        // Retorna os erros de validação.
                        next(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .delete(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var uid, user_2, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        uid = parseInt(req.params.id);
                        return [4 /*yield*/, usersRepository.findOne(uid)];
                    case 1:
                        user_2 = _a.sent();
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, transaction.remove(User_1.User, user_2)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        res.sendStatus(200);
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        next(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        /*                              API - DATA SOURCE                             */
        app
            .route("/api/datasources")
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, dataSources, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, dataSourcesRepository.find({
                                where: { owner: user }
                            })];
                    case 2:
                        dataSources = _a.sent();
                        res.json(dataSources);
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        next(error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .post(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, dataSource_1, dataSourceErrors, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        dataSource_1 = new DataSource_1.DataSource();
                        dataSource_1 = dataSourcesRepository.merge(dataSource_1, req.body, {
                            owner: user,
                        });
                        return [4 /*yield*/, class_validator_1.validate(dataSource_1)];
                    case 2:
                        dataSourceErrors = _a.sent();
                        if (dataSourceErrors.length > 0)
                            throw dataSourceErrors.map(function (error) { return error.constraints; });
                        return [4 /*yield*/, connection.transaction(function (transation) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, transation.insert(DataSource_1.DataSource, dataSource_1)];
                            }); }); })];
                    case 3:
                        _a.sent();
                        res.json(dataSource_1);
                        return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        next(error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        app
            .route("/api/datasources/:id")
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, dataSourceID, dataSource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        dataSourceID = parseInt(req.params.id);
                        return [4 /*yield*/, dataSourcesRepository.findOne(dataSourceID, {
                                where: { owner: user }
                            })];
                    case 2:
                        dataSource = _a.sent();
                        try {
                            res.json(dataSource);
                        }
                        catch (error) {
                            next(error);
                        }
                        return [2 /*return*/];
                }
            });
        }); })
            .put(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, dataSourceID_1, dataSource_2, dataSourceErrors, error_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        dataSourceID_1 = parseInt(req.params.id);
                        return [4 /*yield*/, dataSourcesRepository.findOne(dataSourceID_1, { where: { owner: user } })];
                    case 2:
                        dataSource_2 = _a.sent();
                        dataSource_2 = dataSourcesRepository.merge(dataSource_2, req.body);
                        return [4 /*yield*/, class_validator_1.validate(dataSource_2)];
                    case 3:
                        dataSourceErrors = _a.sent();
                        // Se houver erros de validação, emita um erro.
                        if (dataSourceErrors.length > 0)
                            throw dataSourceErrors.map(function (error) { return error.constraints; });
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.update(DataSource_1.DataSource, dataSourceID_1, dataSource_2)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 4:
                        _a.sent();
                        // Retorne para o usuário os dados atualizados.
                        res.json(dataSource_2);
                        return [3 /*break*/, 6];
                    case 5:
                        error_8 = _a.sent();
                        next(error_8);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); })
            .delete(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, dataSourceID, dataSource, error_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        dataSourceID = parseInt(req.params.id);
                        return [4 /*yield*/, dataSourcesRepository.findOne(dataSourceID, {
                                where: { owner: user }
                            })];
                    case 2:
                        dataSource = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.remove(DataSource_1.DataSource, dataSource)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 4:
                        _a.sent();
                        res.sendStatus(200);
                        return [3 /*break*/, 6];
                    case 5:
                        error_9 = _a.sent();
                        next(error_9);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        /*                                 API - CHART                                */
        app
            .route("/api/charts")
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, charts, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, chartsRepository.find({
                                relations: ["dataSources"],
                                where: { owner: user },
                            })];
                    case 2:
                        charts = _a.sent();
                        res.status(200).json(charts);
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _a.sent();
                        next(error_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .post(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, _a, chart_1, chartErrors, error_11;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _b.sent();
                        if (!("dataSources" in req.body)) return [3 /*break*/, 3];
                        _a = req.body;
                        return [4 /*yield*/, convertToDataSource(req.body.dataSources, user)];
                    case 2:
                        _a.dataSources =
                            _b.sent();
                        _b.label = 3;
                    case 3:
                        chart_1 = new Chart_1.Chart();
                        // O Chart recebe os dados a partir do body e o usuário ao qual ele
                        // pertence é obtido através do ID da sessão.
                        chart_1 = chartsRepository.merge(chart_1, req.body, { owner: user });
                        return [4 /*yield*/, class_validator_1.validate(chart_1)];
                    case 4:
                        chartErrors = _b.sent();
                        if (chartErrors.length > 0)
                            throw chartErrors.map(function (error) { return error.constraints; });
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.save(Chart_1.Chart, chart_1)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 5:
                        _b.sent();
                        // Envia os dados do chart inserido juntamente com o usuário associ-
                        // ado.
                        res.json(chart_1);
                        return [3 /*break*/, 7];
                    case 6:
                        error_11 = _b.sent();
                        next(error_11);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        app
            .route("/api/charts/:id")
            .get(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, cid, chart, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        cid = parseInt(req.params.id);
                        return [4 /*yield*/, chartsRepository.findOne(cid, {
                                relations: ["dataSources"],
                                where: { owner: user }
                            })];
                    case 2:
                        chart = _a.sent();
                        res.json(chart);
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        next(error_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .put(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, cid, chart_2, _a, chartErrors, error_13;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _b.sent();
                        cid = parseInt(req.params.id);
                        return [4 /*yield*/, chartsRepository.findOne(cid, {
                                where: { owner: user }
                            })];
                    case 2:
                        chart_2 = _b.sent();
                        if (!("dataSources" in req.body)) return [3 /*break*/, 4];
                        _a = req.body;
                        return [4 /*yield*/, convertToDataSource(req.body.dataSources, user)];
                    case 3:
                        _a.dataSources =
                            _b.sent();
                        _b.label = 4;
                    case 4:
                        // Atualiza e valida  os dados do Chart.
                        chart_2 = chartsRepository.merge(chart_2, req.body);
                        return [4 /*yield*/, class_validator_1.validate(chart_2)];
                    case 5:
                        chartErrors = _b.sent();
                        // Verifica se há erros nos dados.
                        if (chartErrors.length > 0)
                            throw chartErrors.map(function (error) { return error.constraints; });
                        return [4 /*yield*/, connection.transaction(function (transation) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transation.save(chart_2)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 6:
                        _b.sent();
                        res.json(chart_2);
                        return [3 /*break*/, 8];
                    case 7:
                        error_13 = _b.sent();
                        next(error_13);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); })
            .delete(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, chartID, chart_3, error_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, getUser(req.user.id)];
                    case 1:
                        user = _a.sent();
                        chartID = parseInt(req.params.id);
                        return [4 /*yield*/, chartsRepository.findOne(chartID, {
                                where: { owner: user }
                            })];
                    case 2:
                        chart_3 = _a.sent();
                        return [4 /*yield*/, connection.transaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.remove(Chart_1.Chart, chart_3)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 3:
                        _a.sent();
                        res.sendStatus(200);
                        return [3 /*break*/, 5];
                    case 4:
                        error_14 = _a.sent();
                        next(error_14);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        /* ────────────────────────────────────────────────────────────────────────── */
        app.use(function (error, req, res, next) {
            if (res.headersSent)
                next(error);
            console.log(error);
            if ("code" in error && "message" in error) {
                res.status(400).json({
                    code: error.code,
                    message: error.message
                });
            }
            else {
                res.sendStatus(400);
            }
        });
        app.listen(PORT, function (_) {
            console.log("Server running on port " + PORT + ".");
        });
        return [2 /*return*/];
    });
}); })
    .catch(console.log);
