---
title: Webpack
author: amiskov
date: 2015-10-14 10:30
template: article.jade
---

Вебпак — сборщик модулей. Любой ресурс для Вебпака является модулейм — js-файл, картинка, шрифт, less, CSS, HTML и пр. Вебпак позволяет организовать зависимости и асинхронную подгрузку.
<span class="more"></span>

# Система модулей
Для Вебпака любой ресурс — это модуль. JS, CSS, картинка, шрифт и пр. По умолчанию Вебпак обрабатывает js-модули, для других ресурсов нужно использовать лоадеры:

```js
// файл simple-product.js
let $ = require('jquery'); // пакет из node_modules
let Product = require('./product'); // наш файл

class SimpleProduct extends Product {
    // ...
}
```

## Лоадеры
Вебпак позволяет работать с картинками, CSS, шрифтами  и пр. ресурсами как с модулями (их так же можно реквайрить и сохранять в переменные).

Если просто написать `require('./some.css')`, то при сборке будет ошибка. Вебпак хавает из коробки только js. Для того, чтобы это заработал, например, css-модуль, надо пропустить его подключение через лоадер.

`css-loader` сделает возможной подгрузку CSS-модуля (обернет CSS-файл в js). Содержимое будет можно зареквайрить, сохранить в переменную, но стиль не применится.

Чтобы стиль применился, нужно использовать `style-loader`, который уже встроит стиль в страницу.

Получаем:

```js
require('style!css!./some.css'); // Стили подгрузятся как модуль и применятся на странице
```

Любые подключения шрифтов, картинок и пр. в CSS-файлах Вебпак рассматривает как подключение модуля. Поэтому без соответствующих лоадеров будет ошибка.

`file-loader` переносит ресурс в папку со сборкой, `url-loader` делает так же, но, если размер ресурса (картинки) достаточно мал, может запаковать его в base-64 и встроить в CSS.
 
Не нужно каждый раз писать руками `style!css!less`, эту настройку лучше задать в конфиге.

Соглашение:
`test` используется для првоерки расширения.
`include` - для проверки путей.
http://webpack.github.io/docs/configuration.html#module-loaders

[Список лоадеров](https://webpack.github.io/docs/list-of-loaders.html) для Вебпака на официальном сате.

## PreLoaders
Иногда нужно работать с кодом до того, как его модифицировать. Например, проверить JS с помощью линтера. Для этих 
целей предусмотрен механизм прелоадеров. Они запускаются перед лоадерами.

Пример подключения [ESLint](https://github.com/MoOx/eslint-loader):
```js
module.exports = {
  // ...
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ]
  }
  // ...
}
```

## Асинхронная подгрузка модулей (`require.ensure`)
Вебпак дополняет синтаксис CommonJS для работы с модулями своим методом `.ensure`. Этот метод позволяет организовать асинхронную подгрузку:

```js
require.ensure(['./lib'], function(require) { // Аргумент — функция реквайра
  var lib = require('./lib'); // загрузится отдельным запросом
});
```

Можно и без явного указания массива модулей и аргумента:

```js
require.ensure([], function() { 
  var lib = require('./lib'); // Вебпак найдет реквары тут и дальше сам разберется
});
```

Удобно использовать, например, с jQuery-плагинами, которые что-то отрисовывают не сразу. Например, для слайдера с большими картинками можно асинхронно подключить нужный модуль с плагином, стилями и картинками, а потом после загрузки уже его инициализировать.

Если нужно объединить несколько подключений `require.ensure` в один файл (схожий функционал), то третьим параметром можно передать название такого функционала. Все `require.ensure` с таким именем объединятся в один файл:

```js
// login.js
$logoutButton.click = function() {
    require.ensure([], function() {
        var login = require('./login');
        // ...
    }, 'auth');
};

// logout.js
$logoutButton.click = function() {
    require.ensure([], function() {
        var login = require('./logout');
        // ...
    }, 'auth');
};
```

Вебпак создаст файл `auth.js` и будет его подгружать динамечески, когда понадобиться.

## Bundle loader
Позволяет загружать `require.esure([выражение])`.

# Выделение общего кода (CommonsChunkPlugin)
Вебпак позволяет выделить общий код из всех точек входа с помощью `CommonsChunkPlugin`.

# Подключение jQuery и других библиотек с глобальными переменными
Самый простой способ подключить такую библиотеку — просто отдельный тег `<script>`. Но с Вебпаком можно сделать более
 интересные вещи.

## script-loader
`script-loader` сэмулирует такое поключение библиотеки отдельных тегом `<script src="path/to/jquery.js"></script>`, но при этом библиотека будет включена в сборочный файл, а мы сэкономим один запрос:

```js
// index.js
require('script!jquery'); // Взять jquery из node_modules и пропустить через script-loader
```

Далее `jQuery` и `$` будут доступны в глобальной области видимости во всех модулях.

## ProvidePlugin
Как вариант, можно использовать `ProvidePlugin`, который автоматически будет подключать модуль, если найдет переменную. Например, вот эта настройка говорит, что нужно сделать `require('jquery')`, если найдется в файле `$`,
`jQuery` или `window.jQuery`:

```js
plugins: [ 
  new webpack.ProvidePlugin({ 
      $: ‘jquery’, 
      jQuery: ‘jquery’, 
      ‘window.jQuery’: ‘jquery’
    })
]
```

## Externals
Если библиотека jQuery уже подключена отдельно (например, через CDN), а мы хотим делать `require('jquery')`, то можно об этом сказать Вбпаку с помощью `externals`:

```js
externals: {
    jquery: 'jQuery',
    $: 'jQuery'
}
```

и дальше уже можно делать `require('jquery')`.

Подробнее: https://webpack.github.io/docs/library-and-externals.html

# Config Files
Конфигурационный файл Вебпака — это CommonJS-модуль, который возвращает объект.

Пример:

```js
module.exports = {
    entry: ["./utils.js", "./app.js"], // сольются в бандле
    output: {
        filename: "bundle.js"
    },
    {   // Обработка картинок
        test: /\.(jp?g|gif|png)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=1024&name=[path][name].[hash].[ext]'
        // [hash] — автоматически генерируемый код. 
        // Нужен для лучшего кеширования.
    }
}
```

Теперь в терминале можно просто сказать `webpack` и все настройки возьмутся из конфига.

Конфиг можно реквайрить в другие конфиги. Например, в конфиг для проакшена можно зареквайрить конфиг для дева.

# Command Line Interface (CLI)
Установка Вебпака на уровне системы (чтобы запускать из любого места на диске):

    npm install webpack -g

Пример использования: `webpack ./app.js bundle.js`. Вебпак подключит все зависимости из `app.js`, сделает с ними так, как прописано в конфиге и сохранит результат в `bundle.js`.

# Watch mode
Включить режим пересборки при изменении файлов можно в командной строке: `webpack --watch` или в файле конфига инструкцией `watch: true`.

# Webpack Dev Server
В Вебпак встроен веб-сервер для удобства разработки. Туда же включен и ливрелоад.
 
Сервер нужно установить отдельно: `npm install webpack-dev-server -g`. После установки мы можем его запускать: `webpack-dev-server`.

Вебпак-сервер предложит смотреть страницу по адресу `http://localhost:8080/webpack-dev-server/`. Там будет панелька 
сверху, а разрабатываемый сайт будет исполняться во фрейме.

Если запустить просто `http://localhost:8080/`, лишней панельки не будет, но сервер будет работать без ливрелоада.
Это можно исправить, запустив веб-сервер с флагом `inline`: `webpack-dev-server --inline`. 

# Скрипты запуска
Для сокращенного синтаксиса запуска Вебпака с параметрами можно использовать NPM. В `package.json` есть свойство `"scripts": {}`

Исполнить их можно командой `npm run scriptname`. Пример:

```js
"scripts": {
    "server": "webpack-dev-server --hot --inline --devtool eval --progress --colors",
    "dev":    "env DEV=true server",
    "prod":   "webpack -p --config webpack.config.production.js"
},
```

Запустить скрипты из командной строки можно с помощью `npm run`. 

Сборка для продакшена: `npm run prod`. Вебпак возьмет настройки из файла `webpack.production.js`.
Флаг `-p` (он же `--optimize-minimize`) включает минификацию и обфускацию кода (работает из коробки).

Запустить дев-сервер: `npm run server`. Установится переменная окружения `DEV=true` и запустится сервер с полезными 
при работе параметрами.

Подробнее: http://jaketrent.com/post/list-npm-scripts/

# Минификация
Можно настроить Uglify вручную и только на продакшене через `NODE_ENV`.

# Переменные окружения
Так работает на Винде и на Юниксе: `npm run env NODE_ENV=production`.

Так только на Юниксе: `npm run NODE_ENV=production`

Так только на Винде: `npm run set NODE_ENV=production`

Так переменная сохранится в настройках терминала: `export NODE_ENV=production`

Подробнее: https://docs.npmjs.com/cli/run-script

# Плагины
Модифицировать процесс сборки можно с помощью плагинов. Есть плагины, которые генерируют html-файлы, объявляют глобальные переменные, выносят код в отдельные файлы, оптимизируют модули и пр. См. [список плагинов](https://webpack.github.io/docs/list-of-plugins.html) на сайте Вебпака.

Например, у нас есть модуль `simpleProduct.js`:

```js
require('./simple_product.less');

var Product = require('./product.js');
var simpleProduct = new Product();
```

Здесь первой строкой подулючаются стили. Вебпак приготовит свой js-бандл при сборке и добавит их прямо в js-файл. 

Если нам нужно эти стили вынести в файл и подключить отедльно, можно использовать `ExtractTextPlugin`:

```js
// webpack.config.js
var ExtractTextPlugin = require("extract-text-webpack-plugin"),
module.exports = {
    // ...
    module: {
        loaders: [
            {
                test: /simple_product.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
            }
            // ...
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
};
```

С помощью плагинов можно сильно изменить процесс сборки. Вебпак позволит сделать многое.

[Подробнее](https://webpack.github.io/docs/stylesheets.html#separate-css-bundle) про вынос стилей в отдельынй файл.

О плагинах: http://webpack.github.io/docs/plugins.html

# Source maps
Сорсмапы встроены в Вебпак. Включить их можно параметром: `webpack -d`.

# Несколько точек входа (multiple bundles)
Для сайтов, которые состоят более чем из одной страницы, хорошим тоном будет раскидать функциональность по отдельным файлам. Например, на Хомпейдже нам не нужен скрипт для валидации формы изменения пароля для залогиненого пользователя:

```js
module.exports = {
    entry: {
        home: './src/home.js',
        account: './src/account.js',
        checkout: './src/checkout.js'
        // ...
    },
    output: {
        filename: [name].js // назвать файлы как и точки входа
        path: __dirname + '/dist', // и положить в директорию /dist
    }
};
```

Зависимость от точки входа запрещена. Реквайрить `about.js` из `home.js` не выйдет. Надо, чтобы `about.js` в этом случае был не точкой входа, а модулем.

# Статистика
`webpack --json --profile > stats.json` — вывести статистику в json-файл с учетом временных параметров.

Проверить: http://webpack.github.io/analyse/

# Материалы
https://github.com/petehunt/webpack-howto + доклад посмотреть
https://medium.com/@dtothefp/why-can-t-anyone-write-a-simple-webpack-tutorial-d0b075db35ed
http://survivejs.com/webpack_react/webpack_compared/

http://dontkry.com/posts/code/single-page-modules-with-webpack.html
https://www.youtube.com/watch?v=TaWKUpahFZM

