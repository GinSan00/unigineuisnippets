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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TagsParser {
    tagsData;
    constructor() {
        // Чтение файла tags.json
        const filePath = path.join(__dirname, '../data/tags.json');
        this.tagsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    /**
     * Возвращает список всех категорий
     */
    getCategories() {
        return Object.keys(this.tagsData.categories);
    }
    /**
     * Возвращает список всех тегов в указанной категории
     * @param category Категория
     */
    getTagsInCategory(category) {
        return this.tagsData.categories[category];
    }
    /**
     * Поиск тега по имени
     * @param name Имя тега
     */
    findTagByName(name) {
        for (const category of Object.values(this.tagsData.categories)) {
            for (const tag of category) {
                if (tag.name === name) {
                    return tag;
                }
            }
        }
        return undefined;
    }
    /**
     * Возвращает все возможные атрибуты для указанного тега
     * @param tag Тег
     */
    getAllAttributesForTag(tag) {
        const allAttributes = [];
        for (const listName of tag.used_attribute_lists) {
            const attributeList = this.tagsData.attribute_lists[listName];
            if (attributeList) {
                allAttributes.push(...attributeList);
            }
        }
        return allAttributes;
    }
}
exports.TagsParser = TagsParser;
//# sourceMappingURL=parser.js.map