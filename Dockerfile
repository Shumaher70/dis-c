# Указываем базовый образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Указываем команду по умолчанию для запуска контейнера
CMD ["npm", "run", "dev"]
