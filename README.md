# <a id="top" />Проект: Бэкэнд для сервиса виш-листов

---

### Оглавление

- [Описание](#description)
- [Как использовать](#how-to-use)
- [Автор проекта](#author)

---

## <a id="description" />Описание

REST-API для сервиса виш-листов. Проект написан на Nest.js

### Технологии

- Nest.js
- Typescript

[Наверх](#top)

---

## <a id="how-to-use" />Как использовать

#### Установка

Чтобы установить и развернуть проект выполните следующие команды:

```code
npm i
npm run start:dev
```

Остальные полезные скрипты можно посмотреть в файле package.json, в корне проекта.

#### .ENV Example

Для работы сервера, необходимо создать и положить в корневую папку файл .env
Пример наполнения файла :

```code
  POSTGRES_HOST=host
  POSTGRES_PORT=0000
  POSTGRES_USER=user
  POSTGRES_PASSWORD=*****
  POSTGRES_DB=db_name
  POSTGRES_SYNCHRONIZE=boolean
  SERVER_PORT=0000
  JWT_SECRET=some_secret
  JWT_EXPIERS=24h
```

В корне проекта находится файл .env.example, также содержащий пример для создания кофигурации.

[Наверх](#top)

---

## <a id="author" />Автор

Андрей Колосов 2023г

- [Telegram ](https://t.me/RustyVoid)
- [Instagram](https://www.instagram.com/akolosof/)

[Наверх](#top)
