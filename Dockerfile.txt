FROM python:3.12-slim-bookworm

WORKDIR /app

# Копируем файлы
COPY . .

# Устанавливаем зависимости
# Добавляем uvicorn, так как он нужен для HTTP сервера
RUN pip install --no-cache-dir . uvicorn

# Smithery ожидает, что мы будем слушать этот порт
ENV PORT=8081
EXPOSE 8081

# Запускаем нашу команду
# Скрипт сам увидит переменную PORT и включит HTTP-режим
ENTRYPOINT ["mcp-edit-math"]