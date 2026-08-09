# SkillVault — Step 3 Guide

## What Step 3 adds
- Individual premium course page
- Unique course slug for every course
- Shareable URLs
- Dynamic SEO title and meta description
- Open Graph tags
- Course schema (JSON-LD)
- Related courses
- Share button
- Sitemap template
- robots.txt

## Course URL format
Example:
`course.html?course=ai-productivity-masterclass`

The slug comes from:
`data/courses.json`

Field:
`"slug": "ai-productivity-masterclass"`

## Important for SEO
Once the final free hosting URL is ready, replace:
`YOUR-DOMAIN-HERE`

inside:
- `sitemap.xml`
- `robots.txt`

Step 8 will handle the final hosting URL and Google Search Console submission.

## Best practice for course naming
For authorized creator courses, use descriptive titles naturally.

Example:
`Video Editing Masterclass by Creator Name`

Avoid stuffing the same keyword repeatedly.

## Next step
Step 4 will build stronger search, filters, category browsing and discovery.
