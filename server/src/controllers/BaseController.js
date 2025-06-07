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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const item = yield this.model.create(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
                return res.status(201).json(item);
            }
            catch (error) {
                console.error('Create error:', error);
                return res.status(500).json({ error: 'Failed to create item' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const items = yield this.model.findAll({
                    where: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                return res.json(items);
            }
            catch (error) {
                console.error('Get all error:', error);
                return res.status(500).json({ error: 'Failed to fetch items' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const item = yield this.model.findOne({
                    where: {
                        id: parseInt(req.params.id),
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    },
                });
                if (!item) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                return res.json(item);
            }
            catch (error) {
                console.error('Get by ID error:', error);
                return res.status(500).json({ error: 'Failed to fetch item' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const [updated] = yield this.model.update(req.body, {
                    where: {
                        id: parseInt(req.params.id),
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    },
                });
                if (!updated) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                const item = yield this.model.findByPk(parseInt(req.params.id));
                return res.json(item);
            }
            catch (error) {
                console.error('Update error:', error);
                return res.status(500).json({ error: 'Failed to update item' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const deleted = yield this.model.destroy({
                    where: {
                        id: parseInt(req.params.id),
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    },
                });
                if (!deleted) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                return res.status(204).send();
            }
            catch (error) {
                console.error('Delete error:', error);
                return res.status(500).json({ error: 'Failed to delete item' });
            }
        });
    }
}
exports.default = BaseController;
