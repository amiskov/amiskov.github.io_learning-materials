# Даша
+
Закрывается по клику на `body`. Но не закрывается по клику на `html`. Лучше отслеживать клик на `$(document)`.
Открытие-закрытие по классу.

-
Забыла про остальной контент. Надо `position: absolute` для выпадалки.
Опять у Даши конструктор делает что-то непонятное.

# Объяснить
Где ставить, а где не ставить ;
Еще раз про работу конструктора: создается пустой `this`, в него все пихается и возвращается.
`var select` должен как раз таки возвращаться. Это и есть `this` у конструктора `new Select()`.
Разобрать по шагам, как работает у Даши конструктор.
Не забывать про 'use strict'. ВСЕГДА ПИСАТЬ С НИМ.
`_this` и `self` — это костыли. Нужно об этом помнить. Без особой надобности лучше не использовать. Есть байнды и $
.proxy().