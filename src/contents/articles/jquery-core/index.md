---
title: Ядро jQuery
author: amiskov
date: 2015-08-6 10:30
template: article.jade
---

Обзор основного функционала jQuery.
<span class="more"></span>

<!--
# Случаи, когда лушче не использовать jQuery
Основная задача jQuery — обеспечить кроссбраузерность. Современные браузеры (возьмем IE9+) в этом плане лучше своих 
предсшественников и многие возможности в ES5 реализованы нативно и работают быстрее, чем аналоги jQuery.

В основном нативный функционал лучше использовать вместо утилитарныйх методов jQuery.

## $.each
Для массивов есть свйо `forEach` (IE9+).

## $.inArray
Для массивов есть свой `indexOf` (IE9+).

## Материалы
* http://youmightnotneedjquery.com/ — набор аналогов jQuery-методам на нативном JS и DOM.
* http://kangax.github.io/compat-table/es5/ — таблица совместимости ES5.
-->

# jQuery Object ($)
При работе с DOM разные браузеры могут вести себя по-разному. jQuery берет на себя проблемы совместимости и
предоставляет удобные методы работы с элементами.

При создании и выборке элементов функция `$` возвращает расширенную коллекцию элементов. Индексы идут с 0, имеется 
свойство `length` и ряд методов, похожих на методы массивов.

## Проверка коллекции на пустоту
jQuery в любом случае вернет коллекцию, а она всегда будет `true` при преобразованию у булевому значению. Поэтому при
проверке коллекции на пустоту нужно смотреть на свойство `.length`:

```javascript
var $sections = $( 'section' );

// BROKEN CODE:
if ($sections) { alert( 'Test' ); } // всегда сработает, пустой массив вернет true

// OK
if ($sections.length) { alert( 'Test' ); } // сработает только когда есть элементы section
```

## Изменение коллекции и изменение документа
jQuery коллекции — не «живые», как `getElementsByName` и `getElementsByClassName`. Выборка запоминается и, если в 
html произошли изменения, то ее надо переопределить.

## Выбор элемента, eq() и get()
Если из коллекции нам нужно выбрать определенный элемент, мы можем выбрать его по индексу:

```javascript
var $headings = $( 'h1' );
$headings.eq(0); // вернет первый элемент из коллекции, jQuery object
```

Если нам нужно выбртаь не расширенный эелмент, а обычный DOM-элемент, то можно воспользоваться методом `get()`:

```javascript
$headings.get(0); // вернет первый элемент из коллекции, но уже как DOM object
$headings.[0];    // аналогично, вернет DOM object
```

Таким образом, коллекция jQuery — это псевдо-массив DOM-элементов и куча методов, наследованных от объекта jQuery. 
Это можно увидеть в консоли:
    
```javascript
console.dir( $headings );        // псевдо-массив DOM-объектов
console.log( $headings.eq(0) );  // псевдо-массив с одним DOM-объектом
console.log( $headings.get(0) ); // один DOM-объект
```
    
## Сравнение объектов jQuery
Каждый расширенный jQuery-объект уникален. Даже если объекты сделаны из одного селектора, они не равны.
    
Чтобы в коде было четко видно, где jQuery объекты, а где простые DOM-объекты и переменные, к jQuery-выборкам 
добавляют префикс `$`: `var $title = $('h1')`.

## $ vs. $()
Можно встретить методы, типа `$.each()` и `$('ul').each`. Они принадлежать к разным областям jQuery.

Методы, которые вызываются через `$.` — утилиты jQuery. Могут возвращать разные вещи.

Методы, которые работают с селекторами (`$('ul')`), получают и возвращают коллекцию как `this`. Они принадлежат к 
области видимости `$.fn`.

`$.fn` — "jQuery prototype". Методы объектов jQuery, работают с коллекциями элементов.

## Выбор элемента с id, в котором содержатся символы из CSS-нотации (точки и двоеточия)
В этом случае точки и двоеточия экранируются двумя слешами:

```javascript
// BROKEN CODE
$( 'some:id' ); $( 'some.id' );

// А так нормально:
$( 'some\\:id' ); $( 'some\\.id' );
```

## Материалы
* http://learn.jquery.com/using-jquery-core/jquery-object/
* http://learn.jquery.com/using-jquery-core/dollar-object-vs-function/
* http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/

# .css()
С помощью метода `.css()` можно получить значение css-свойства, установить его или установить пачку css-свойств:

Получить значение css-свойства:

```javascript
$( "h1" ).css( "fontSize" );  // Returns a string such as "19px".
$( "h1" ).css( "font-size" ); // Also works.
```
    
Установить значение css-свойства (свойств):

```javascript
$( "h1" ).css( "fontSize", "100px" ); // Setting an individual property.

// Setting multiple properties.
$( "h1" ).css({
    fontSize: "100px",
    color: "red"
});
```

При передаче в метод `.css()` свойства должны быть в виде camelCase (`fontSize: "10px"`) или в виде строки 
(`"font-size": "10px"`).

Не стоит пользоватьсы методом css для установки стилей. Лучше все делать через классы, так будет работать быстрее.

## Использование CSS-классов
Внешний вид элементов нужно задавать через CSS-классы. JS не должен отвечать за визуальное представление. Поэтому 
метод `.css()` нормально использовать как геттер, но как сеттер его лучше не применять.

Для работы с классами имеются методы `.addClass()`, `.removeClass()`, `.toggleClass()`. Наличие класса можно проверить
при помощи метода `.hasClass()`:
 
```javascript
var h1 = $( "h1" );
 
h1.addClass( "big" );
h1.removeClass( "big" );
h1.toggleClass( "big" );
 
if ( h1.hasClass( "big" ) ) {
    ...
}
```
    
# Методы для работы с data
Часто нужно вместе с элементом хранить какие-то данные о нем. Для этого в jQuery есть специальные методы:
 
```javascript
$( "#myDiv" ).data( "keyName", { foo: "bar" } ); // сохранить объект в свойство keyName
$( "#myDiv" ).data( "keyName" ); // Returns { foo: "bar" }
```

Таким образом за элементом можно закрепить _любой_ вид данных. В том числе и ссылки на другие элементы.

Например, нам нужно установить связь между элементом списка и дивом внутри него. Чтобы каждый раз не дергать DOM, 
можно сохранить референс однажды и потом по нему доставать нужный див:

```javascript
$( "#myList li" ).each(function() {
 
    var li = $( this );
    var div = li.find( "div.content" );
 
    li.data( "contentDiv", div );
});
 
// Теперь нам не нужно находить див в DOM, можно просто достать его из data
var firstLi = $( "#myList li:first" );
firstLi.data( "contentDiv" ).html( "new content" );
```

Так же можно передать сразу пачку data-свойств:

```javascript
$el.data({
    'str': 'Hello',
    'bool': true,
    'arr': [1, 2, 3],
    'obj': { isOk: true }
});
```
        
# Работа с размерами элемента
Basic dimensions methods.
     
```javascript
// Sets the width of all <h1> elements.
$( "h1" ).width( "50px" );
 
// Gets the width of the first <h1> element.
$( "h1" ).width();
 
// Sets the height of all <h1> elements.
$( "h1" ).height( "50px" );
 
// Gets the height of the first <h1> element.
$( "h1" ).height();
 
 
// Returns an object containing position information for
// the first <h1> relative to its "offset (positioned) parent".
$( "h1" ).position();
```

## Материалы
* [CSS, Styling & Dimensions](http://learn.jquery.com/using-jquery-core/css-styling-dimensions/)
* [Category: Dimensions](http://api.jquery.com/category/dimensions/)
        
# Получение индекса элемента или свойства, .index()
Метод `.index()` можно вызывать четырьмя способами и вести он будет себя по-разному. Если `.index()` вызывается над 
коллекцией, то берется первый элемент.

## 1. Использование .index() без аргументов
При вызове без аргументов вернется индекс объекта (от нуля) в коллекции:

```html
<ul>
    <li id="test">test 1</li>
    <li>test 2</li>
    <li>test 3</li>
</ul>
```
```javascript
var $test = $('li#test');
$test.index(); // => 0
```
    
## 2. Использование .index() со строковым аргументом
Рассмотрим пример:

```html
<ul>
    <div class="test"></div>
    <li id="foo1">foo</li>
    <li id="bar1" class="test">bar</li>
    <li id="baz1">baz</li>
    <div class="test"></div>
</ul>
<div id="last"></div>
```
   
`.index( 'selector' )` запрашивает `.first()`:

```javascript
var $lis = $( 'li' );
$lis.index( 'li' ); // => 0
```

`$li.index( 'li' )` ищет вхождения `'li'` по _всему документу_ и выводит индекс элемента относительно всех `<li>` в 
документе:
 
```javascript
$('#last').index('div'); // => 2 
```

## 3. Использование .index() с jQuery-object в качестве аргумента
В этом случае ищется индекс элемента (первого, если передана коллекция) в скобках внутри коллекции, на которой вызыван 
`.index()`.

## 4. Использование .index() с DOM-object в качестве аргумента
Работает аналогично случаю с передачей jQuery-объекта.        
        

# Перебор jQuery объектов и примитивов
В jQuery есть метод `$.each` для перебора массивов, псевдо-массивов и объектов (примитивов) и `.each` для перебора 
jQuery-объектов (выборок). Они никак не пересекаются.

Так же имеются шорткаты `$.map` и `.map`, которые решают определенные частные случаи переборов (подмножестово `each`).

## $.each()
Это метод-утилита для работы с примитивами: массивами, псевдомассивами и объектами (не с jQuery-объектами).

Пример для массива:

```javascript
    var sum = 0;
     
    var arr = [ 1, 2, 3, 4, 5 ];
    $.each( arr, function( index, value ){
        sum += value;
    });
     
    console.log( sum ); // 15
```

Пример для объекта:

```javascript
    var sum = 0;
    var obj = {
        foo: 1,
        bar: 2
    }

    $.each( obj, function( key, value ) {
        sum += value;
    });
     
    console.log( sum ); // 3
```

## .each()
Итератор для работы с jQuery-коллекциями. Каждый элемент коллекции обрабатывается коллбэком, в который передается 
индекс элемента и его DOM-представление (не jQuery-объект). Это DOM-представление так же равно `this`:

```javascript
    $( "li" ).each( function( index, listItem ) {

        this === listItem; // true

        // For example only. You probably shouldn't call $.ajax() in a loop.
        $.ajax({
            success: function( data ) {
               // The context has changed.
               // The "this" keyword no longer refers to listItem.
               this !== listItem; // true
            }
        });

    }); 
```
       
Второй аргумент `listItem` равен `this` в контексте коллбэка. Однако бывает, что внутри коллбэка есть другие функции,
внутри которых будет свой `this` и для читабельности кода в этом случае лучше использовать второй аргумент.        

Часто методы jQuery не требуют запуска итератора. Например, так класс добавится ко всем `li` без перебора:

```javascript
    $( "li" ).addClass( "newClass" );
```
    
Но некоторые требуют конктетного обращения к каждому элементу:

```javascript
    $( "input" ).each( function( i, el ) {
        var elem = $( el );
        elem.val( elem.val() + "%" );
    });
```

Часто геттеры возвращают значение первого элемента из колекции, а сеттеры, наоборот, обрабатывают всю коллекцию.
В такие сеттеры можно передать в качестве устанавливаемого значения коллбэк-функцию, которая пройдется по всем элементам
коллекции:

```javascript
    $( "input" ).val( function( i, el ) {
        var elem = $( el );
        elem.val( elem.val() + "%" );
    });
```
    
## .map()
Пробегается по всем элементам коллекции и производит какие-то операции над каждым элементом. Возвращает 
jQuery-коллекцию.

Если нужно вернуть простой массив, то заканчиваем цепочку методом `.get()`:

```javascript
    $( "li" ).map( function(index, element) {
        return this.id;
    }).get();
```
    
Цепочку можно продолжать методами массива. Например сделать `.reverse()` после `.get()`.

## $.map()
Этот метод перебирает примитивы (массивы и объекты). В нем параметры `index` и `value` имеют другой порядок, чем в
`.each` и прочих переборных методах для совместимости с ES5:

```javascript
    var dimensions = { width: 10, height: 15, length: 20 };
    dimensions = $.map( dimensions, function( value, index ) {
      return value * 2;
    });
```    
# Работа с элементами
## Get/Set
Большинство методов позволяют и установить и получить значение:

```javascript
.html()
.text()
.height()/.width()
.val()

.position() // get only
``` 

Установка нового значения затронет все элементы выборки:
    
```javascript    
$( 'h1' ).text('Hello'); // изменятся все h1
```

# Перемещение, копирование и удаление элементов
Работая с элементами, у нас бывают 2 задачи:

1. Поместить выбранный элемент относительно другого элемента.
2. Поместить какой-то элемент относительно выбранного элемента.

`$el.insertAfter( '#otherElement' )` - поместить `$el` после `#otherElement`.

Аналогично будет: `$( '#otherElement' ).after($el)`.

Таким же образом работают:
    
    .insertAfter()  | .after()
    .insertBefore() | .before()
    .appendTo()     | .append()
    .prependTo()    | .preped()

## Какой метод вставки выбрать?
Если нужно сохранить ссылку на вставляемый элемент, то выбирает первую колонку: `.insertAfter` и подобные. Эти методы 
вернут вставляемый элемент и можно будет с ним работать дальше в цепочке или сохранить в переменную:

    var $test = $( '<i>test</i>' )
                    .insertAfter( 'form' )
                    .animate({ 'marginLeft': '10px' });
    
Эти методы _переносят_ элементы, не копируют. Если нам нужно именно скопировать элемент, то в начале нужно будет 
создать новый такой же, т. е. сделать его клон.

## Клонирование
Элементы клонируются методом `.clone( [false|true] )`. Этот методы вернет клонируемый элемент:

    $( 'form' ).clone().appendTo( 'body' ); // Копия без данных и событий. Например, обработчик submit не сработает.
    
Если нам нужно клонировать элемент со всеми закрепленными данными и обработчиками, то нужно передать флаг `true`:

    $( 'form' ).clone(true).appendTo( 'body' ); // Все данные и обработчики сохранятся так же.
    
## Удаление элементов
`.remove()` — удалить выборку из документа. Метод вернет удаляемую выборку, все обработчики и данные будут так же 
удалены. Применяется, когда элементы нам больше не нужны. Или когда нужны, но без обработчиков и данных.

`.detach()` — удалить выборку из документа с _сохранением_ всех данных и обработчиков. Применяется, если нужно дальше
работать с удаляемыми элементами.
    
`.detach()` стоит использовать, когда нам нужно переработать структуру какого-то элемента (например, доабвить/удалить 
строки в таблицу). Сначала детачим элемента, делаем, что нужно, потом вставляем его обратно. Так мы не трогаем DOM, а
работаем с элементом в памяти. Это сокращает число запросов к дереву DOM и обеспечивает лучшую производительность.
    
`.empty()` — удалить содержимое элемента (его `innerHTML`).    
    
## Создание элементов
Создавать элементы можно с помощью функции `$()`:

    $( "<p>This is a new paragraph</p>" );
    $( "<a/>", {
        html: "This is a <strong>new</strong> link",
        "class": "new", // зарезервированное слово, пэотому в кавычках
        href: "foo.html"
    });
    
Созданные элементы нужно еще добавить в DOM с помощью методов `.append()`, `.insertAfter()` и пр.
    
Когда нужно добавить много элементов, не стоит это делать в цикле. Лучше сформировать содержимое и добавить его в DOM
один раз.
    
## Работа с атрибутами
Метод `.attr()` позволяет получить значение атрибута, установить его или записать сразу пачку атрибутов. При этом в 
качестве заначения можно передать функцию, которая получает индекс текущего элемента, текущее значение атрибута и 
возвращает новое значение:
 
    $( 'a' ).attr( 'href', 'newDestination.html' );
    $( 'a' ).attr({
        rel: 'nofollow',
        href: function( idx, href ) {
            return '/new/' + href
        }
    });

    
## Материалы
* http://learn.jquery.com/using-jquery-core/manipulating-elements/
* http://api.jquery.com/category/manipulation/
* http://api.jquery.com/category/attributes/

    
# Коллекции и селекторы    
## Проверка на видимость элементов
Псевдо-селекторы jQuery `:hidden` и `:visible` смотрят не на css-свойства, а на физическое представление элемента, его 
ширину и высоту. Исключение - только `tr`. У него берется `display`.

## Скорость
По возможности начинаем выборку с селектора по `id`. Так будет быстрее всего.

Если надо использовать выборку несколько раз — сохнаняем ее в переменную, имя начинаем с доллара:

    var $divs = $('div');

`$divs` сохранит только те элементы, которые присутствую на странице при создании переменной.

Если нужна динамическая выборка (живая коллекция), то можно использовать `elem.getElementsBy[Name|TagName|ClassName]`.
В этом случае элементы не будут сохраняться, а будут выбираться каждый раз при вызове.

## Проверка выборки на пустоту
Проверить, не пустая ли выборка:

    // Это не сработает.
    // Всегда вернется объект, а он будет преобразован в true.
    if ( $( "div.foo" ) ) {
        ...
    }
    
    // Вот так правильно. Тут 0 станет false:
    if ( $( "div.foo" ).length ) {
        ...
    }

## Фильтры
Когда выборку нужно ограничить, можно к ней применить фильтры:

    // Усечение выборок: 
    $( "div.foo" ).has( "p" );         // div.foo в которых есть <p>
    $( "h1" ).not( ".bar" );           // h1 без класса .bar
    $( "ul li" ).filter( ".current" ); // li с классом .current
    $( "ul li" ).first();              // Первый li
    $( "ul li" ).eq( 5 );              // Шестой li

## filter vs. find
`.filter` - урезать коллекцию, `.find` - найти что-то внутри элемента.

## Выбор элементов формы по типу и состоянию
jQuery имеет собственный удобный API (псевдо-селекторы) для выборки элементов формы по типу и состоянию. Такого в CSS 
нет.

Чтобы выборка по псевдо-селекторам работала быстро и использовала `querySelectorAll`, а не механизмы поиска jQuery, 
нужно сначала найти элемента, а потом их отфильтровать по псевдо-селектору:

    `$('#myForm').find('input').filter(':checked');
 
По состоянию:

**:checked** - все выбранные элементы формы. Учитываются checkbox, radio и &lt;select&gt;&lt;option&gt;:

```javascript
$( "#myForm input:checked" );
```

**:disabled** - найти все элементы формы с атрибутом `disabled`:

    $(' #myForm ').find('input').filter(':disabled'); // Так будет работать быстрее всего
    $(' #myForm input').filter(':disabled'); // Можно так
    $(' #myForm input:disabled'); // Или так, тэг или выборка перед псевдо-селектором
    $(' #myForm :disabled'); // А так лучше не надо

**:enabled** - элементы без атрибута `disabled`. Инверсия псевдо-селектора `:disabled`:

    $(' #myForm input').filter(':enabled'); // Сначала выбираем, потом фильтруем
    $(' #myForm input:enabled'); // Так тоже можно

**:input** - выбрать все элементы, с типами input, textarea, select и button:

**:selected** — выбрать все выбранные option. Работает именно с тегами `<option>`:

    // BROKEN CODE: Так работать не будет
    $( '#myForm' ).find( 'select' ).filter( ':selected' );
    
    // А так будет:
    $( '#select1' ).find( 'option' ).filter(':selected');

По типу:

    $( '#myForm' ).find( 'input' ).filter( ':password' );
                                            :reset
                                            :radio
                                            :text
                                            :submit
                                            :checkbox
                                            :button
                                            :image
                                            :file

## Работа с коллекциями
Методы, вызываемые из коллекций могут быть сеттерами и геттерами. Если передаем параметр — получается сеттер, если 
параметра нет, то геттер.

Сеттеры затронут **все** элементы из колекции:

    $( 'h1' ).html( 'Hello world' ); // Все h1 на странице изменят содержимое на 'Hello world'
    
Геттеры вернут значение только первого элемента (за исключением `.text()`):

    $( 'h1' ).html(); // Содержимое первого h1 из коллекции
    
`.text()` вернет текстовый контент вообще всех заголовков:

    $( 'h1' ).text(); // Текст вообще всех h1 на странице в одной строке

## Цепочки вызовов    
Цепочку вызовов можно продолжать при сеттерах (они вернут jQuery object), а геттеры вернут только то, что у них 
запросили, поэтому такая штука не сработает:

    // BROKEN CODE: геттер вернет строку, цепочка вызовов закончится
    $( "h1" ).html().addClass( "test" );
    
Chaining хорошая штука, но нужно знать меру. Чтобы код получился более читабельным, лучше разбивать вызовы по строкам:

    $( "#content" )
        .find( "h3" )
        .eq( 2 )
            .html( "new text for the third h3!" )
            .end() // Restores the selection to all h3s in #content
        .eq( 0 )
            .html( "new text for the first h3!" );

Здесь `.end()` вернет нас к первоначальной выборке (все h3).


# Передвижение по выборке
Элементы в выборке, по которым мы можем передвигаться, могут быть 3 типов: parents, children, siblings (родители, 
дети и братья).

## HTML для демонстрации

    <div class="grandparent">
        <div class="parent">
            <div class="child">
                <span class="subchild"></span>
            </div>
        </div>
        <div class="surrogateParent1"></div>
        <div class="surrogateParent2"></div>
    </div>

## Родительские элементы (parents)
Чтобы выбрать определенные родительские элементы доступны следующие методы: .parent(), .parents(), .parentsUntil() 
and .closest():

    // Вернет [ div.child ]
    $( "span.subchild" ).parent();
     
Выбрать родительские элементы, соответствующие селектору:
     
    $( "span.subchild" ).parents( "div.parent" ); // [ div.parent ]
    $( "span.subchild" ).parents(); // [ div.child, div.parent, div.grandparent ]
     
Выбрать родителей до селектора, _не включая его_:
     
    $( "span.subchild" ).parentsUntil( "div.grandparent" ); // [ div.child, div.parent ]
     
Выбрать один ближайший родительский элемент. В том числе вернется _сам элемент_, если он соответствует селектору:
     
    $( "span.subchild" ).closest( "div" ); // [ div.child ]
    $( "div.child" ).closest( "div" ); // [ div.child ], вернется сам элемент, т. к. он включен в поиск
                                       // и соответствует селектору

## Дочерние элементы (children)
Для доступа к дочерним элементам используются методы `.children()` и `.find()`.
 
`.children()` — работает только с непосредственными детьми (div > p).
`.find()` — углубляется рекурсивно внутрь элемента

Выбор непосредственных детей:
     
    $( "div.grandparent" ).children( "div" ); // [ div.parent, div.surrogateParent1, div.surrogateParent2 ]
     
Все элементы в выборке, которые соответствуют селектору:
     
    $( "div.grandparent" ).find( "div" ); // [ div.parent, div.child, div.surrogateParent1, div.surrogateParent2 ]

## Одноуровневые элементы (братья, siblings)
Для поиска одноуровневых элементов используются метды `.prev()`, `.next()`, `.siblings()`, `.prevAll()`, `.prevUntill()`,
`.nextAll()`.

Следующий элемент такого же уровня:

    $( "div.parent" ).next(); // [ div.surrogateParent1 ]
 
Предыдущий селектор такого же уровня:
 
    $( "div.parent" ).prev(); // [] as No sibling exists before div.parent
 
Все последующие элементы такого же уровня:

    $( "div.parent" ).nextAll(); // [ div.surrogateParent1, div.surrogateParent2 ]
    $( "div.parent" ).nextAll().first(); // [ div.surrogateParent1 ]
    $( "div.parent" ).nextAll().last(); // [ div.surrogateParent2 ]
 
Все предыдущие элементы такого же уровня:

    $( "div.surrogateParent2" ).prevAll(); // [ div.surrogateParent1, div.parent ]
    $( "div.surrogateParent2" ).prevAll().first(); // [ div.surrogateParent1 ]
    $( "div.surrogateParent2" ).prevAll().last(); // [ div.parent ]

Все элементы такого же уровня во всех направлениях (и до и после):

    $( "div.parent" ).siblings(); // [ div.surrogateParent1, div.surrogateParent2 ]
    $( "div.surrogateParent1" ).siblings(); // [ div.parent, div.surrogateParent2 ]

## Сложные переходы
Не стоит строить длинные цепочки переходов. Нужно иметь ввиду, что при поддержке сайта DOM может изменяться со 
временем и длинные переходы могут перестать работать. Пара-тройка элементов — ок, а если нужно найти дочерние 
элементы в соседнем блоке, тот тут лучше отдельно найти элементы. Так гибче.

## Материалы
* [Traversing](http://learn.jquery.com/using-jquery-core/traversing/)
* [Category: Tree Traversal](http://api.jquery.com/category/traversing/tree-traversal/)

# Полезные функции из $
В объекте `$` содержится масса полезных фнукций для рутинных задач.

Вот несколько примеров.

## $.trim()
Убирает лишние пробелы в начале и в конце:

    $.trim( "    lots of extra whitespace    " ); // "lots of extra whitespace"

## $.each
Перебор массивов и объектов:

    $.each([ "foo", "bar", "baz" ], function( idx, val ) {
        console.log( "element " + idx + " is " + val );
    });
     
    $.each({ foo: "bar", baz: "bim" }, function( k, v ) {
        console.log( k + " : " + v );
    });

`$.each != .each`

`$.each()` работает с примитивами: массивы и объекты, `.each()` работает только с выборкой jQuery.

Для массивов есть нативный `Array.prototype.forEach`.

## $.inArray()
Вернет индекс значения или -1, если значение не нашлось:

    var myArray = [ 1, 2, 3, 5 ];
     
    if ( $.inArray( 4, myArray ) !== -1 ) {
        console.log( "found it!" );
    }
 
Начиная с IE9 есть нативный `Array.prototype.indexOf`.

## $.extend()
Расширяет (изменяет и дополняет) свойства первого объекта свойствами других объектов:

    var firstObject = { foo: "bar", a: "b" };
    var secondObject = { foo: "baz" };
     
    var newObject = $.extend( firstObject, secondObject );
     
    console.log( firstObject.foo ); // "baz", изменилось
    console.log( newObject.foo ); // "baz"    

Если не нужно изменять первый объект, то первым аргументом нужно передать пустой объект:

    var firstObject = { foo: "bar", a: "b" };
    var secondObject = { foo: "baz" };
     
    var newObject = $.extend( {}, firstObject, secondObject );
     
    console.log( firstObject.foo ); // "bar"
    console.log( newObject.foo ); // "baz"

## $.proxy()
Назначает контекст выполнения для функции. Вторым аргументом передается объект:

    var myFunction = function() {
        console.log( this );
    };
    var myObject = {
        foo: "bar"
    };
     
    myFunction(); // window
     
    var myProxyFunction = $.proxy( myFunction, myObject );
     
    myProxyFunction(); // myObject
    
Если нужно сохранить контекст для метода из объекта (оставить в методе `this`, равный этому объекту), то в `$.proxy` 
нужно передать объект и имя метода. В этом случае вернется функция, за которой закрепится контекст:
    
    var myObject = {
        myFn: function() {
            console.log( this );
        }
    };
     
    $( "#foo" ).click( myObject.myFn ); // HTMLElement #foo
    $( "#foo" ).click( $.proxy( myObject, "myFn" ) ); // myObject

Начиная с IE9 есть нативный `.bind(this)` для функций. Последний пример можно написать так:

    $( "#foo" ).click( myObject.myFn.bind(myObject) );

Или так:

    $( "#foo" ).click( function() { myObject.myFn.call(myObject) } );

Или так:

    $( "#foo" ).click( function() { myObject.myFn() } );

## Проверка типов
Есть методы для проверки типа значения:

    $.isArray([]); // true. Есть нативный аналог: Array.isArray([]), IE9+
    $.isFunction(function() {}); // true
    $.isNumeric(3.14); // true
    
Помимо этого имеется метод `$.type()`, который проверяет тип значения по его прототипу:

    $.type( true ); // "boolean"
    $.type( 3 ); // "number"
    $.type( "test" ); // "string"
    $.type( function() {} ); // "function"
     
    $.type( new Boolean() ); // "boolean"
    $.type( new Number(3) ); // "number"
    $.type( new String('test') ); // "string"
    $.type( new Function() ); // "function"
     
    $.type( [] ); // "array"
    $.type( null ); // "null"
    $.type( /test/ ); // "regexp"
    $.type( new Date() ); // "date"



## Материалы
* [Utility Methods](http://learn.jquery.com/using-jquery-core/utility-methods/)
* [Category: Utilities](http://api.jquery.com/category/utilities/)            