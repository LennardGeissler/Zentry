"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const tedious_1 = require("tedious");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    server: process.env.DB_HOST || 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER || 'zentry-admin',
            password: process.env.DB_PASSWORD || 'zentry123',
        },
    },
    options: {
        trustServerCertificate: true,
        database: 'master', // Connect to master first to create the database
        encrypt: false,
    },
};
function executeSqlFile(connection, filePath) {
    return new Promise((resolve, reject) => {
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        const sqlStatements = sqlContent.split('GO').filter(stmt => stmt.trim());
        let currentStatement = 0;
        function executeNextStatement() {
            if (currentStatement >= sqlStatements.length) {
                resolve();
                return;
            }
            const request = new tedious_1.Request(sqlStatements[currentStatement].trim(), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                currentStatement++;
                executeNextStatement();
            });
            connection.execSql(request);
        }
        executeNextStatement();
    });
}
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new tedious_1.Connection(config);
        connection.on('connect', (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error('Error connecting to database:', err);
                process.exit(1);
            }
            try {
                console.log('Connected to database. Initializing...');
                const sqlFilePath = path.join(__dirname, 'init-database.sql');
                yield executeSqlFile(connection, sqlFilePath);
                console.log('Database initialization completed successfully.');
            }
            catch (error) {
                console.error('Error initializing database:', error);
            }
            finally {
                connection.close();
            }
        }));
        connection.connect();
    });
}
initializeDatabase();
