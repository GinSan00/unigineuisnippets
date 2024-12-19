import { CompletionItemKind, Position, Range, TextDocument } from 'vscode';
import { TagsParser } from './parser';

const parser = new TagsParser();

export function provideAttributeCompletions(document: TextDocument, position: Position): any[] {
  const linePrefix = document.lineAt(position).text.substr(0, position.character);
  const isInsideTag = /<[a-zA-Z]+/.test(linePrefix); // Проверяем, находимся ли внутри тега

  let items: any[] = [];

  if (isInsideTag) {
    // Если внутри тега, предлагаем атрибуты
    const tagName = linePrefix.match(/<([a-zA-Z]+)/)?.[1]; // Извлекаем имя тега
    const tag = parser.findTagByName(tagName);

    if (tag) {
      const attributes = parser.getAllAttributesForTag(tag);
      items = attributes.map((attr) => ({
        label: attr,
        kind: CompletionItemKind.Property,
        insertText: `${attr}=`
      }));
    }
  }

  return items;
}