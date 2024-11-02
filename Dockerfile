# Użyj Node.js jako obrazu bazowego
FROM node:20

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj package.json i package-lock.json (jeśli jest) dla backendu i frontendu
COPY ./backend/package*.json ./backend/
COPY ./frontend/package*.json ./frontend/

# Zainstaluj zależności backendu i frontendu
RUN npm install --prefix ./backend && npm install --prefix ./frontend

# Skopiuj pozostałe pliki projektu
COPY ./backend ./backend
COPY ./frontend ./frontend

# Zbuduj frontend
RUN npm run build --prefix ./frontend

# Expose porty
EXPOSE 3000 80

# Uruchom backend i frontend
CMD cd backend && npm start & sleep 15 && cd frontend && npm run serve
