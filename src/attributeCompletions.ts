import { CompletionItemKind, Position, Range, TextDocument } from 'vscode';
import { TagsParser } from './parser';

const parser = new TagsParser();

export function provideAttributeCompletions(document: TextDocument, position: Position): any[] {
  const line = document.lineAt(position);
  const prefix = line.text.substring(0, position.character);
  let items: any[] = [];

  // Проверяем, находится ли курсор внутри тега
  if (prefix.includes('<') && !prefix.includes('>')) {
    // Если внутри тега, предлагаем атрибуты
    const tagName = prefix.match(/<([a-zA-Z]+)/)?.[1]; // Извлекаем имя тега
    const tag = parser.findTagByName(tagName);

    if (tag) {
      const attributes = parser.getAllAttributesForTag(tag);
      items = attributes.map((attr) => ({
        label: attr,
        kind: CompletionItemKind.Property,
        insertText: `${attr}=""`
      }));
    }
  }

  return items;
}