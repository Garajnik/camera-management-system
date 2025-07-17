
# Используем Node.js для сборки и запуска
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы и собираем проект
COPY . .
RUN npm run build

# Открываем порт (по умолчанию vite preview слушает 4173)
EXPOSE 4173

# Запуск preview-сервера Vite
CMD ["npm", "run", "preview"]
