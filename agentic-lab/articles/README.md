# Initial articles

This directory contains initial articles for the database.

Each file starts with a header block between `---`:

```
---
description: The description for the article.
keywords: comma separated list of tags
---
```

After the header block, there is the article body as markdown.

In the header block, you can define properties used to create the initial articles. The properties
are listed as `name: value` pairs. Known properties:

- `description`: The description for the article.
- `keywords`: Comma separated list of tags
- `title`: title of the article. If the title is not defined, the first markdown H1 header `#` found in the body is used.