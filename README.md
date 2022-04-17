# Pat Bot
Bot co robi wszystko i nic

## Zaproszenie
https://discord.com/api/oauth2/authorize?client_id=707871048020000808&permissions=0&scope=bot

## Hostowanie bota
Zalecane jest korzystanie z oficjalnej instancji bota. 
Bot bez edycji source kodu jest dosyć mało customizowalny (na stan pisania tego jedyne cos można zmienić to jego prefix), jednak jeżeli z jakiegoś powodu chcesz hostować swoją własną instancję to oto jak:

### Wymagania:
- [node.js](https://nodejs.org/) - Wersja 16 lub nowsza
- [npm](https://www.npmjs.com/)
- [ts-node](https://typestrong.org/ts-node/)

### Instrukcje:
1. Stwórz bazę danych [mongodb](https://www.mongodb.com/)
2. Sklonuj repo i zainstaluj pakiety npm:
```bash
git clone https://github.com/Ketok4321/PatBot
cd PatBot
npm ci
```
3. Stwórz plik `.env` z zawartością:
```
PREFIX=twój epicki prefix (dopisz spacje na końcu i dodaj " jeżeli chcesz żeby działał jak w oficjalnej instancji ('pat komenda' zamiast 'patkomenda'))
TOKEN=twój epicki token bota discord
DB_CONN_STRING=twój epicki link do połączenia się z bazą danych
```

4. Uruchom bota komendą `npm start`