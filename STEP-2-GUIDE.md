# SkillVault — Step 2 Course Management Guide

## 1. Change the main Telegram account
Open:
`data/settings.json`

Change:
`"telegramUsername": "YOUR_TELEGRAM_USERNAME"`

Do not include @.

## 2. Add a new course
Open:
`data/course-template.json`

Copy the full object and paste it inside:
`data/courses.json`

Change these fields:
- id
- slug
- title
- creator
- category
- price
- oldPrice
- badge
- image
- description
- tags
- featured
- trending
- recentlyAdded

## 3. Add your own course image
Place the image inside:
`assets/`

Example:
`assets/dhruv-rathee-course.jpg`

Then put the same path in the course:
`"image": "assets/dhruv-rathee-course.jpg"`

## 4. Per-course Telegram account
If all courses use one Telegram account, leave:
`"telegramUsername": ""`

If one course needs a different Telegram account:
`"telegramUsername": "another_username"`

## 5. Per-course message
Leave `"telegramMessage": ""` to auto-generate a message containing course title and creator.

Or write your own message.

## 6. Homepage controls
Open:
`data/settings.json`

You can edit:
- brand name
- Telegram username
- default Telegram message
- popular searches
- maximum courses shown initially

## 7. Smart collections
Each course supports:
- `"featured": true`
- `"trending": true`
- `"recentlyAdded": true`

These automatically power the homepage filters.

## Important
Use this website only for courses/content you are authorized to distribute or sell.
