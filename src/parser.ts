import * as fs from 'fs';
import * as path from 'path';

// Интерфейсы для типов данных
interface AttributeList {
  [key: string]: string[];
}

interface Tag {
  name: string;
  description: string;
  used_attribute_lists: string[];
}

interface Category {
  [key: string]: Tag[];
}

interface TagsData {
  attribute_lists: AttributeList;
  categories: Category;
}

export class TagsParser {
  private tagsData: TagsData;

  constructor() {
    // Чтение файла tags.json
    const filePath = path.join(__dirname, '../data/tags.json');
    this.tagsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  /**
   * Возвращает список всех категорий
   */
  public getCategories(): string[] {
    return Object.keys(this.tagsData.categories);
  }

  /**
   * Возвращает список всех тегов в указанной категории
   * @param category Категория
   */
  public getTagsInCategory(category: string): Tag[] | undefined {
    return this.tagsData.categories[category];
  }

  /**
   * Поиск тега по имени
   * @param name Имя тега
   */
  public findTagByName(name: string): Tag | undefined {
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
  public getAllAttributesForTag(tag: Tag): string[] {
    const allAttributes: string[] = [];
    for (const listName of tag.used_attribute_lists) {
      const attributeList = this.tagsData.attribute_lists[listName];
      if (attributeList) {
        allAttributes.push(...attributeList);
      }
    }
    return allAttributes;
  }
}