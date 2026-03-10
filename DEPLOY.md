# Деплой (Vercel)

- **Production** на Vercel собирается с ветки **main**.
- Чтобы задеплоить изменения: пушите в **main** (или смержите свою ветку в main и запушьте).

## Как пушить и деплоить

Если вы работаете в ветке **master** (или другой):

```bash
git checkout main
git merge master
git push origin main
```

Если вы работаете сразу в **main**:

```bash
git add .
git commit -m "ваше сообщение"
git push origin main
```

После пуша в **main** Vercel автоматически запустит сборку и задеплоит сайт.

## Рекомендация

В настройках репозитория на GitHub (**Settings → General → Default branch**) поставьте **main** как ветку по умолчанию. Тогда основная работа будет в main и деплой будет предсказуемым.
