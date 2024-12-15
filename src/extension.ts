import * as vscode from 'vscode';

// Массивы с объектами, содержащими название тега и его описание
const containers = [
    { name: 'window', description: 'Окно приложения' },
    { name: 'vbox', description: 'Вертикальный бокс' },
    { name: 'hbox', description: 'Горизонтальный бокс' },
    { name: 'vpaned', description: 'Разделитель с вертикальной панелью' },
    { name: 'hpaned', description: 'Разделитель с горизонтальной панелью' },
    { name: 'gridbox', description: 'Табличная структура' },
    { name: 'groupbox', description: 'Группа виджетов' },
    { name: 'tabbox', description: 'Набор вкладок' },
    { name: 'scrollbox', description: 'Прокручиваемая область' },
    { name: 'dialog', description: 'Диалоговое окно' }
];

const widgets = [
    { name: 'tooltip', description: 'Подсказка' },
    { name: 'button', description: 'Кнопка' },
    { name: 'canvas', description: 'Холст для рисования' },
    { name: 'checkbox', description: 'Флажок' },
    { name: 'combobox', description: 'Комбинированный список' },
    { name: 'editline', description: 'Поле ввода одной строки' },
    { name: 'edittext', description: 'Многострочное поле ввода' },
    { name: 'hscroll', description: 'Горизонтальная полоса прокрутки' },
    { name: 'hslider', description: 'Горизонтальный ползунок' },
    { name: 'hspacer', description: 'Горизонтальное пространство' },
    { name: 'icon', description: 'Значок' },
    { name: 'label', description: 'Метка' },
    { name: 'listbox', description: 'Список' },
    { name: 'menubar', description: 'Панель меню' },
    { name: 'menubox', description: 'Меню' },
    { name: 'spinbox', description: 'Поле ввода числа с кнопками увеличения/уменьшения' },
    { name: 'sprite', description: 'Спрайт' },
    { name: 'treebox', description: 'Дерево' },
    { name: 'vscroll', description: 'Вертикальная полоса прокрутки' },
    { name: 'vslider', description: 'Вертикальный ползунок' },
    { name: 'vspacer', description: 'Вертикальное пространство' }
];

const tags = [
    { name: 'align', description: 'Выравнивание' },
    { name: 'reference', description: 'Ссылка на другой объект' },
    { name: 'include', description: 'Включение внешнего .ui файла' }
];


// Список атрибутов для всех тегов
const commonAttributes = [
    { label: 'name', insertText: 'name="$1"', documentation: 'Уникальное имя виджета' },
    { label: 'export', insertText: 'export="$1"', documentation: 'Если export = "yes", то виджет будет доступен внутри кода по его уникальному имени' },
    { label: 'next', insertText: 'next="$1"', documentation: 'Имя следующего элемента, на который будет перемещён фокус при нажатии Tab' },
    { label: 'align', insertText: 'align="$1"', documentation: 'Набор флагов для выранивания виджета (left, right, center, top , bottom, expand, overlap, background, fixed)' },
    { label: 'enabled', insertText: 'enabled="$1"', documentation: 'Включает и выключает виджет. Выключенный виджет не принимает никаких команд ввода' },
    { label: 'hidden', insertText: 'hidden="$1"', documentation: 'Включает и отключает рендер виджета' },
    { label: 'pos_x', insertText: 'pos_x="$1"', documentation: 'Координата X виджета относительно верхнего левого угла его родительского контейнера. Работает, только если установлен align="overlap".' },
    { label: 'pos_y', insertText: 'pos_y="$1"', documentation: 'Координата Y виджета относительно верхнего левого угла его родительского контейнера. Работает, только если установлен align="overlap".' },
    { label: 'width', insertText: 'width="$1"', documentation: 'Ширина виджета' },
    { label: 'height', insertText: 'height="$1"', documentation: 'Высота виджета' },
    { label: 'reference', insertText: 'reference="$1"', documentation: 'Параметр, отвечабщий за возможность ссылки на обьект. Если значение равно 0, то этот объект можно переиспользовать с помощью тега Reference' },
];

const includeAttribute = [{ label: 'name', insertText: 'name="$1"', documentation: 'Путь к .ui файлу.' }];
const referenceAttribute = [{ label: 'name', insertText: 'name="$1"', documentation: 'Имя контейнера на который делается ссылка.' }];

const textAttributes = [
    { label: 'rich', insertText: 'rich="$1"', documentation: 'Отвечает за то, является ли текст внутри тега форматированным (с отступами, выравниванием и т.п.) или обычным. Значение по умолчанию равно 0, что соответствует обычному.' },
    { label: 'face', insertText: 'face="$1"', documentation: 'Путь к файлу шрифта' },
    { label: 'size', insertText: 'size="$1"', documentation: 'Размер текста в пикселях' },
    { label: 'color', insertText: 'color="$1"', documentation: 'Цвет текста' },
    { label: 'permanent', insertText: 'permanent="$1"', documentation: 'Изменение цвета текста при отключении виджета. Значение по умолчанию равно 0, что соответствует сохранению цвета текста.' },
    { label: 'outline', insertText: 'outline="$1"', documentation: 'Обводка текста. Значение по умолчанию равно 0, что соответствует отключению обводки.' },
    { label: 'wrap', insertText: 'wrap="$1"', documentation: 'Перенос текста, если он не соотвествует длине контейнера.' },
    { label: 'hspacing', insertText: 'hspacing="$1"', documentation: 'Расстояние между символами в слове в пикселях.' },
    { label: 'vspacing', insertText: 'vspacing="$1"', documentation: 'Расстояние между строками текста в пикселях.' },
    { label: 'hoffset', insertText: 'hoffset="$1"', documentation: 'Горизонтальный отступ текста в пикселях. Значение по умолчанию равно 0, что соответствует отключению отступа.' },
    { label: 'voffset', insertText: 'voffset="$1"', documentation: 'Вертикальный отступ текста в пикселях. Значение по умолчанию равно 0, что соответствует отключению отступа.' },
    { label: 'translate', insertText: 'translate="$1"', documentation: 'Может ли текст быть переведён при смене языка. Значение по умолчанию равно 0, что соответствует переводу текста при выборе с языка.' },
];

const fontAttributes = [
    { label: 'face', insertText: 'face="$1"', documentation: 'Путь к файлу шрифта' },
    { label: 'size', insertText: 'size="$1"', documentation: 'Размер текста в пикселях' },
    { label: 'color', insertText: 'color="$1"', documentation: 'Цвет текста' },
    { label: 'outline', insertText: 'outline="$1"', documentation: 'Обводка текста. Значение по умолчанию равно 0, что соответствует отключению обводки.' },
    { label: 'hspacing', insertText: 'hspacing="$1"', documentation: 'Расстояние между символами в слове в пикселях.' },
    { label: 'vspacing', insertText: 'vspacing="$1"', documentation: 'Расстояние между строками текста в пикселях.' },
    { label: 'spacing', insertText: 'spacing="$1"', documentation: 'Общее расстоние между строками в пикселях.' },
];

const imageAttributes = [
    { label: 'src', insertText: 'src="$1"', documentation: 'Путь до изображения.' },
    { label: 'color', insertText: 'color="$1"', documentation: 'Множитель цвета изображения.' },
    { label: 'x', insertText: 'x="$1"', documentation: 'X координата.' },
    { label: 'y', insertText: 'y="$1"', documentation: 'Y координата.' },
    { label: 'dx', insertText: 'dx="$1"', documentation: 'Смещение изображения относительно оси X.' },
    { label: 'dy', insertText: 'dy="$1"', documentation: 'Смещение изображения относительно оси Y.' },
    { label: 'x in container', insertText: 'x="%$1"', documentation: 'X координата относительно контейнера.' },
    { label: 'y in container', insertText: 'y="%$1"', documentation: 'Y координата относительно контейнера.' },
    { label: 'scale_x', insertText: 'scale_x="%$1"', documentation: 'X маштаб изображения в процентах по отношению к изначальному изображения. Значение по умолчанию равно 100.' },
    { label: 'scale_y', insertText: 'scale_y="%$1"', documentation: 'Y маштаб изображения в процентах по отношению к изначальному изображения. Значение по умолчанию равно 100.' },
    { label: 'scale', insertText: 'scale="%$1"', documentation: 'Общий маштаб изображения в процентах по отношению к изначальному изображения. Значение по умолчанию равно 100.' },
];

// Функция для создания CompletionItem для тега
function createTagCompletionItem(tagObject: { name: string, description: string }) {
    const item = new vscode.CompletionItem(`<${tagObject.name}>`, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(`<${tagObject.name}>$0</${tagObject.name}>`);
    item.documentation = `${tagObject.description}`;
    return item;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "unigineuisnippets" is now active!');

    const provider = vscode.languages.registerCompletionItemProvider(
        'ui',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
                const line = document.lineAt(position).text;
                const charBeforeCursor = line[position.character - 1]; // Символ перед курсором
                const tagRegex = /<\w+>/g;
                let match;

                // Проверка, находится ли курсор внутри какого-то тега
                while ((match = tagRegex.exec(line)) !== null) {
                    const currentTag = match[0].slice(1, -1); // Получение имени текущего тега без угловых скобок

                    // Если текущий тег есть в одном из списков, добавляем его атрибуты
                    const allTags = [...containers, ...widgets];
                    if (allTags.some(item => item.name === currentTag)) {
                        if (currentTag === 'text') {
                            return getTextAttributes(); // Специальные атрибуты для тега 'text'
                        } else if(currentTag === 'image'){
                            return getImageAttributes();
                        }else if(currentTag === 'font'){
                            return getFontAttributes();
                        }else if(currentTag === 'include'){
                            return getIncludeAttributes();
                        }else if(currentTag === 'reference'){
                            return getRefAttributes();
                        }
                        else {
                            return getCommonAttributes(); // Общие атрибуты для других тегов
                        }
                    }
                }

                // Если курсор после символа "<"
                if (charBeforeCursor === '<') {
                    return getTagsSuggestions();
                }

                // Если курсор внутри тега
                if (isInsideTag(line, position.character)) {
                    return getWidgetsSuggestions();
                }

                // Изначально предлагаем контейнеры
                return getContainersSuggestions();
            }
        },
        ''
    );

    context.subscriptions.push(provider);
}

// Проверяет, находится ли курсор внутри тега
function isInsideTag(line: string, cursorPosition: number): boolean {
    const openTagIndex = line.lastIndexOf('<', cursorPosition);
    const closeTagIndex = line.indexOf('>', cursorPosition);

    return openTagIndex !== -1 && closeTagIndex !== -1 && openTagIndex < cursorPosition && cursorPosition < closeTagIndex;
}

// Возвращает общие атрибуты
function getCommonAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(commonAttributes.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}

// Возвращает предложения для контейнеров
function getContainersSuggestions(): vscode.CompletionList {
    return new vscode.CompletionList(containers.map(createTagCompletionItem));
}

// Возвращает предложения для виджетов
function getWidgetsSuggestions(): vscode.CompletionList {
    return new vscode.CompletionList(widgets.map(createTagCompletionItem));
}

// Возвращает предложения для тегов
function getTagsSuggestions(): vscode.CompletionList {
    return new vscode.CompletionList(tags.map(createTagCompletionItem));
}
function getTextAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(textAttributes.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}
function getImageAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(imageAttributes.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}
function getFontAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(fontAttributes.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}
function getIncludeAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(includeAttribute.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}
function getRefAttributes(): vscode.CompletionList {
    return new vscode.CompletionList(referenceAttribute.map(attr => new vscode.CompletionItem(attr.label, vscode.CompletionItemKind.Property)));
}
export function deactivate() {}