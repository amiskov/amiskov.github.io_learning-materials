---
title: jQuery Widget Factory
author: amiskov
date: 2015-09-09 10:30
template: article.jade
---
_Статься готова процентов на 70_<br>
Если мы имеем дело с компонентами, которые хочется сделать объектами, то плагины могут быть не слишком удобны в 
использовании. Для таких случаев придумали jQuery Widget Factory.
<span class="more"></span>

Плагины нужны, чтобы расширить существующий функционал фреймворка. Обычно они запускаются на коллекции, что-то с ней 
делают и возвращают эту же коллекцию, обеспечивая цепочность вызовов.

Обычно jQuery-плагины применяются без настроек и результат их выполнения всегда одинаков. `$('div').text('Hello')` 
— для такого рода операций плагин — самое то.

В Magento 2.0 Widget Factory [является стандартом](http://devdocs.magento.com/guides/v2.0/coding-standards/code-standard-jquery-widgets.html) для создания компонентов интерфейса.

Если нам нужно реализовать плагин, для которогу нужно произвести инициализацию, следить за его [состоянием](http://en.wikipedia.org/wiki/State_%28computer_science%29) и изменять 
его в зависимости от разлиынх условий, возможно, дестроить, то тут потребуется писать код, типичных для многих таких 
виджетов. Разные авторы могут по-разному подходить к реализации API своих виджетов. Это влечет снижение 
консистентности кода и лишние затраты времени на изучение API.

Widget factory предоставляет ряд соглашений и готовых решений для того, чтобы написание виджетов было однотипным и 
получаемый API работал одним образом. Сохраняем время на рутинных операциях, типа инициализации и дестроя, используем
соглашения для приватных и публичных метоодов, получаем более более качественный результат и экономим время на 
рутинных операциях. Научились использовать один виджет из jQuery UI — умеем пользоваться всеми.

Соглашения:
* Создание и удаление виджетов;
* Установка и получение опций (геттеры и сеттеры);
* Вызов методов;
* Прослушивание событий, которые инициирует виджет.


Состояние объекта — набор данных о нем в текущий момент времени: значение (проценты в прогрессбаре), открыт он или 
закрыт, какой пункт выделеин и т. д.

Виджеты имеют жизненный цикл — от инициализации до дестроя.

Инициализация прогрессбара:

```js
// Без параметров, с дефолтными настройками
$( "#elem" ).progressbar();
// Со своими параметрами
$( "#elem" ).progressbar({ value: 20 });
```

Параметры — часть состояния виджета. Их мы можем менять в течение жизненного цикла через метод `option`.

Для того, чтобы создавать более ООП-ориентированные сущности и в то же время быть в среде jQuery придумали [jQuery 
Widget Factofy](http://jqueryui.com/widget/), которая является частью jQuery UI и может быть использована отдельно 
(7Кб в сжатом виде). 

## Консистентность кода
jQuery Widget Factory прежде всего решает задачу по организации кода. Следование соглашениям в команде позволяет не 
тратить время раздумывая над API виджета при разработке и над вызосом методов, установкой свойств при использовании.

## Параметры при инициализации
Для плагина хорошая практика — набор дефолтных опций и предоставление внешнего интерфейса к ним:

```js
$.fn.plugin = function( options ) {
    options = $.extend( {}, $.fn.plugin.defaults, options );
    // Plugin logic goes here.
};
 
$.fn.plugin.defaults = {
    param1: "foo",
    param2: "bar",
    param3: "baz"
};
```

Здесь мы вручную выносим дефолтные настройки в метод функции, пользуясь тем, что функция — это объект. `$.widget` 
позволяет это делать даже проще:

```
$.widget( "ns.plugin", {
 
    // Default options.
    options: {
        param1: "foo",
        param2: "bar",
        param3: "baz"
    },
 
    _create: function() {
        // Options are already merged and stored in this.options
        // Plugin logic goes here.
    }
 
});
```

Мы из коробки имеем смерженные дефолтные и юзерские параметры и доступ к ним извне.

## Методы
После инициализации виджета мы можем следить за его состоянием, менять его и выполнять с помощью виджета какие-то 
действия. Выполнить действие — запустить метод. Метода запускается так:

```js
$( "#elem" ).progressbar( "value" ); // Геттер
$( "#elem" ).progressbar( "value", 40 ); // Сеттер (передали параметр)
// Обычно виджет возвращает jQuery object, так что можно продолжать цепочку:
$( "#elem" )
    .progressbar( "value", 90 )
    .addClass( "almost-done" );
```

### Общие методы
Некоторые методы идут из коробки.

**option** позволяет установить параметр после инициализации виджета:

```js
// Получить значение (геттер)
$( "#elem" ).progressbar( "option", "value" );

// Установить значение (сеттер)
$( "#elem" ).progressbar( "option", "value", 30 );

// Перезаписать сразу несколько параметров
$( "#elem" ).progressbar( "option", {
    value: 100,
    disabled: true
});
```

Получение и установка значений следует синтаксису jQuery core. Например, `$('div').css()`. Отличие в том, что в 
виджет передается еще одни параметр — имя метода.

**disable** — метод для отключения виджета. Например, прогрессбар становится серым и перестает изменяться.

```js
$( "#elem" ).progressbar( "disable" );
$( "#elem" ).progressbar( "option", "disabled", true ); // Эквивалентный синтаксис
```

**enable** — метод включения виджета (выключение отключения &uarr;):

```js
$( "#elem" ).progressbar( "enable" );
$( "#elem" ).progressbar( "option", "disabled", false ); // Эквивалентный синтаксис
```

**destroy** — грохнуть виджет и вернуть первоначальную разметку. Закончить жизненный цикл виджета:

```js
$( "#elem" ).progressbar( "destroy" );
```

После удаления виджета работать с ним нельзя. Надо работать — инициализируем заново. При вызове `.remove()` у 
элемента виджета, при изменении `.html()` или вызове `.empty()` у родителей `destroy` вызывается автоматически.

**widget** вернет сгенерированную виджетом разметку. Если таковой нет, то вернется исходный элемент:

```js
$( "#elem" ).progressbar( "widget" );
```

## События
Видеты могут триггерить события при изменении состояния. Обычно к именам событияй виджета добавляется префикс — 
название виджета:

```js
$( "#elem" ).on( "progressbarchange", function() {
    alert( "The value has changed!" );
});
```

Каждому событию соответствует коллбэк, который мы можем переопределить:

```js
$( "#elem" ).progressbar({
    change: function() {
        alert( "The value has changed!" );
    }
});
```

### Общие события
У всех виджетов уже есть событие `create`, которое сработает при создании виджета.
  

## Написание виджета
Рассмотрим написание виджета на примере [прогрессбара](http://jqueryui.com/progressbar/).

В метод `$.widget` передается 2 параметра: имя плагина и объект с его функционалом:

```js
$.widget( "nmk.progressbar", { // nmk — namespace, progressbar - widget name
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass( "progressbar" ).text( progress );
    }
 
});
```    

## Соглашения
Пространство имен: имя плагина начинается с неймспейса, далее следует точка и после точки идет имя плагина:
`nmk.progressbar`. Неймспейс `ui` занят компонентами библиотеки jQuery UI. Нам следует использовать свое собственное 
пространство имен.

`this.element` — объект jQuery (единичный). Если плагин, созданный через Widget Factory, вызывается на коллекции 
элементов jQuery, то для каждого элемента создается свой собственный экземляр. Эти экземпляры унаследуют методы и 
свойства от одного прототипа.
 
`this.options` — объект с опциями, которые переданы при инициализации.

Значения по умолчанию (опции и коллбэки) мы можем обозначить как объект `options`:

```js
$.widget( "nmk.progressbar", {
 
    // Default options.
    options: {
        value: 0,
        
        callback: null // Callbacks are also here
    },
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass( "progressbar" ).text( progress );
    }
 
});
```

Widget factory предоставляет удобные способ управления состоянием плагина и соглашение по выполнению частых задач, 
типа работы с приватными и внешними методами.



## Добавление методов
Мы можем добавить методы в наш объект, в том числе приватные, начав их имена с подчеркивания:

```js
$.widget( "nmk.progressbar", {
    options: {
        value: 0
    },
 
    _create: function() {
        var progress = this.options.value + "%";
        this.element.addClass("progressbar").text( progress );
    },
 
    // Create a public method.
    value: function( value ) {
 
        // No value passed, act as a getter.
        if ( value === undefined ) {
 
            return this.options.value;
 
        // Value passed, act as a setter.
        } else {
 
            this.options.value = this._constrain( value );
            var progress = this.options.value + "%";
            this.element.text( progress );
 
        }
 
    },
 
    // Create a private method.
    _constrain: function( value ) {
 
        if ( value > 100 ) {
            value = 100;
        }
 
        if ( value < 0 ) {
            value = 0;
        }
 
        return value;
    }
 
});
```

Для вызова методов нужно передать параметр в jQuery-плагин. Если нужно установить значение, то передаем его следом:

```js
var bar = $( "<div />" ).appendTo( "body").progressbar({ value: 20 });
 
// Get the current value.
alert( bar.progressbar( "value" ) );
 
// Update the value.
bar.progressbar( "value", 50 );
 
// Get the current value again.
alert( bar.progressbar( "value" ) );
```

Это не самый удобный способ работы. Так сделано для того, чтобы по-минимуму воздействовать своими методами на объект 
`$`.

## Работа с опциями
Widget Factory предоставляет возможность работы с опциями автоматически: ???

````js
$.widget( "nmk.progressbar", {
 
    options: {
        value: 0
    },
 
    _create: function() {
        this.element.addClass( "progressbar" );
        this._update();
    },
 
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
 
    _update: function() {
        var progress = this.options.value + "%";
        this.element.text( progress );
    }
 
});
````

## Callbacks
Для запуска коллбэка существует метод `_trigger`:

```js
$.widget( "nmk.progressbar", {
 
    options: {
        value: 0
    },
 
    _create: function() {
        this.element.addClass( "progressbar" );
        this._update();
    },
 
    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },
 
    _update: function() {
        var progress = this.options.value + "%";
        this.element.text( progress );
        if ( this.options.value == 100 ) {
            this._trigger( "complete", null, { value: 100 } );
        }
    }
 
});
```

## Как работает Widget Factory
Когда мы создаем виджет, мы передаем в него неймспейс.имя и объект. WF создаст конструктор и будет использовать 
переданный объект как прототип для него. Весь дефолтный функционал будет браться из `jQuery.Widget.prototype`.


# Итого
Нет четких рецептов, когда что надо использовать. Нужно знать как работает экосистема jQuery, что хорошо и что плохо.
Нужно уметь пользоваться тем, что предоставляе библиотека и сообщество. Однако, стоит понить о том, что прежде всего — сделанная задача. Так, если на проекте нужен 
слайдер, то, возможно, его стоит сделать просто через конструктор. Если элемент точно будет использоваться повторно, 
то стоит подумать о применении плагина.

При создании, экземпляр виджета сохраняется в `.data` DOM-объекта:

```js
var bar = $( "<div />")
    .appendTo( "body" )
    .progressbar()
    .data( "nmk-progressbar" );
 
// Call a method directly on the plugin instance.
bar.option( "value", 50 );
 
// Access properties on the plugin instance.
alert( bar.options.value );
```

Widget Factory позволяет работать с прототипом всех созданных сущностей. Добавляя новые методы, они становятся 
доступны всем эзкемплярам:

```js
$.nmk.progressbar.prototype.reset = function() {
    this._setOption( "value", 0 );
};
```
# Материалы
https://learn.jquery.com/jquery-ui/
http://learn.jquery.com/plugins/stateful-plugins-with-widget-factory/
http://api.jqueryui.com/jQuery.widget
http://devdocs.magento.com/guides/v2.0/coding-standards/code-standard-jquery-widgets.html
