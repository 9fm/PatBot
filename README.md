# Pat Bot
Bot co robi wszystko i nic
Jak na razie prace nad nim są praktycznie wstrzymane, od czasu do czasu naprawie w nim jakiś błąd czy coś i w zasadzie to tyle

## Zaproszenie
https://discord.com/api/oauth2/authorize?client_id=707871048020000808&permissions=0&scope=bot

## Self-hostowanie bota
Zalecane jest korzystanie z oficjalnej instancji bota, jednak jeżeli z jakiegoś powodu chcesz hostować swoją własną instancję to można to zrobić za pomocą docker-compose:
```yaml
services:
  bot:
    image: reg.ketok.xyz/patbot
    env_file: .env
    restart: unless-stopped
```
Plik `.env` powinien wyglądać tak:
```
PREFIX=twój epicki prefix (dopisz spacje na końcu i dodaj " jeżeli chcesz żeby działał jak w oficjalnej instancji ('pat komenda' zamiast 'patkomenda'))
TOKEN=twój epicki token bota discord
DB_CONN_STRING=twój epicki link do połączenia się z bazą danych
```
