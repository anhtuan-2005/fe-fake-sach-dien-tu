# Sử dụng Node.js LTS
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng 5173 cho Vite
EXPOSE 5173

# Chạy Vite với --host để có thể truy cập từ bên ngoài container
CMD ["npm", "run", "dev", "--", "--host"]
