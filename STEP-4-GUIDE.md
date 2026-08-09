# SkillVault — Step 4 Guide

## What Step 4 adds
- Advanced search
- Category filter
- Creator filter
- Level filter
- Price filter
- Sort by price, rating and recently added
- Trending collection
- Best Seller collection
- Featured collection
- Recently Added collection
- Active filter chips
- Result count
- Course rating / reviews / level fields

## New editable fields in courses.json
Each course now supports:

`"priceValue": 499`
Used for price filtering.

`"bestSeller": true`
Shows the course in Best Seller.

`"rating": 4.8`
Displayed on the course card.

`"reviews": 157`
Displayed beside rating.

`"level": "Beginner"`
Allowed examples:
- Beginner
- Intermediate
- All Levels

## Important
Keep `"price"` as display text, for example `"₹499"`.
Keep `"priceValue"` as a plain number, for example `499`.

## Next
Step 5 will focus on trust, conversion, support, policy and credibility pages.
