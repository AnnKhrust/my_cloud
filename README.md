# Дипломный проект по профессии «Fullstack-разработчик на Python»

## Облачное хранилище My Cloud

git clone https://github.com/AnnKhrust/my_cloud.git

### ШАГ 1: Backend

cd my_cloud

pipenv shell

pip install -r requirements.txt

cp .env.example .env

Отредактируйте файл .env 

python manage.py migrate

python manage.py runserver

python manage.py createsuperuser

### ШАГ 2: Frontend
cd frontend

npm install

npm run dev
