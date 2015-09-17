# Стас
+
'use strict'
Показывается по классу.
Так лучше не делать (почему?):
    
    $select.trigger({
       type: 'custom.select.change',
       regionid: 562
    }); 

Способ через метод гораздо красивее:

    $select.changeValue(562);


-
Можно было бы избавиться от `_this`. Через `$.proxy(this, 'functionName')`.
Не закрывается по клику на документ
`_this.trigger({` строка 49, там не нужен `_this`.

# Можно лучше
Создаватьэлементы красивее так (строка 18):

    var $li = $('<li></li>', {
        class: 'select-custom__item js-select-item',
        'data-id': key,
        text: regions[key]
    });

# Компонет или плагин (сделать отдельную лекцию после плагинов)
Мы занимаемся ООП, поэтому объекты и компоненты для нас весьма важные штуки.

Плагин — расширяет существующий функционал. Пример — placeholder для инпута. `$.fn` - это `jQuery.prototype`.
Компонент — самостоятельная сущность. Самостоятельный виджет, типа селекта региона.

Плагин для jQuery - это то, что непосредственно с ним связано: работа с DOM, аякс.
Компонент — то, что в принципе от jQuery не зависит. Сущность, как черный ящик, который дает возможность дергать его 
и получать отклик не вдаваясь в подробности реализации.

Плагин добавляет все в существующий объект $, компонент создает новый объект, независимую сущность.

Касательно jQuery, хорошим тоном считается делать компоненты не через плагины, а через jQuery UI `$.widget`. https://learn.jquery.com/jquery-ui/widget-factory/why-use-the-widget-factory/

Принцип - каждый компонент должен выполнять только свою роль, на столько малую, на сколько это возможно.

http://blog.millermedeiros.com/stop-writing-plugins-start-writing-components/
https://learn.jquery.com/jquery-ui/widget-factory/why-use-the-widget-factory/

Прочитать по этому поводу (Османи написал): http://www.smashingmagazine.com/2011/10/essential-jquery-plugin-patterns/
http://stackoverflow.com/questions/6681466/jquery-plugin-patterns-something-more-object-oriented