from django.contrib.auth import get_user_model
import re

UserModel = get_user_model()


def validate_username(username):
    username = username.strip()

    if UserModel.objects.filter(username=username).exists():
        return { 'message': 'Пользователь с таким логином уже существует.', 'input_name': 'username' }
    
    match_symbols = re.search(r'[\'\"\`@_!#$%^&*()<>?/\|}{~:]+', username)
    if match_symbols:
        return { 'message': 'Логин должен состоять только из букв и цифр.', 'input_name': 'username' }
    
    if not username[0].isalpha():
        return { 'message': 'Логин должен начинаться с буквы.', 'input_name': 'username' }
    
    if len(username) < 4 or len(username) > 20:
        return { 'message': 'Длина логина должна от 4 до 20 символов.', 'input_name': 'username' }
    return True


def validate_password(password):
    password = password.strip()
    
    if len(password) < 6:
        return { 'message': 'Длина пароля должна быть не меньше 6 символов.', 'input_name': 'password' }
    
    match_letters = re.search(r'[a-zA-Z]+', password)
    match_numbers = re.search(r'[0-9]+', password)
    match_symbols = re.search(r'[\'\"\`@_!#$%^&*()<>?/\|}{~:]+', password)
    if not match_letters or not match_numbers or not match_symbols:
        return { 
            'message': 'В пароле должна быть хотя бы одна буква, одна цифра и один специальный символ.',
            'input_name': 'password'
        }
    return True

def is_valid_email(email):
    email = email.strip()

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if re.match(pattern, email):
        return True
    else:
        return { 
            'message': 'Не верный формат email.',
            'input_name': 'email'
        }

def validate_file_size(size):
    if int(size) >= 104_857_600:
        return { 'message': 'Файл слишком большой' }
    return True
