import { CompletionItemKind, Position, Range, TextDocument } from 'vscode';
import * as vscode from 'vscode';
import { TagsParser } from './parser';

const parser = new TagsParser();

export function provideCompletionItems(document: TextDocument, position: Position): any[] {
  const lineText = document.lineAt(position).text;
  const linePrefix = lineText.substring(0, position.character);

  if (!linePrefix.startsWith('<')) {
    // Предложим только открывающие теги
    const categories = parser.getCategories();
    const items = categories.flatMap((category) => {
      const tags = parser.getTagsInCategory(category);
      return tags?.map((tag) => ({
        label: `${tag.name}`,
        kind: CompletionItemKind.Class,
        documentation: tag.description,
        insertText: `<${tag.name}></${tag.name}>`,
        textEdit: vscode.TextEdit.insert(
          new Position(position.line, position.character),
          `<${tag.name}></${tag.name}>`
        )
      })) || [];
    });
    
    return items;
  }
  else{
    const tagNameStartIndex = linePrefix.lastIndexOf('<') + 1;
    const tagNameEndIndex = linePrefix.indexOf('>', tagNameStartIndex);
    const potentialTagName = linePrefix.substring(tagNameStartIndex, tagNameEndIndex === -1 ? undefined : tagNameEndIndex);
  
      const categories = parser.getCategories();
      const items = categories.flatMap((category) => {
        const tags = parser.getTagsInCategory(category);
        return tags?.filter((tag) => tag.name.startsWith(potentialTagName)).map((tag) => ({
          label: `${tag.name}`,
          kind: CompletionItemKind.Class,
          documentation: tag.description,
          insertText: `${tag.name}></${tag.name}>`,
          textEdit: vscode.TextEdit.replace(
            new Range(new Position(position.line, tagNameStartIndex), position),
            `${tag.name}></${tag.name}>`
          )
        })) || [];
      });
  
      return items;
  // Если уже введён символ '<' — предложим закрывающий тег

  }

  return [];
}