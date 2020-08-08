---
Blog: true
---

```
>>>PMARK
#!/bin/bash
cd "$RUN_FROM"  # move to base exobrain directory
# generate markdown that displays blog feed
{ while read -r indexdir; do
	# grab title and date from yaml at top
	blog_title=$(grep -m1 Title "$indexdir/README.md" | cut -d" " -f2- | tr -d "\n")
	blog_date=$(grep -m1 Date "$indexdir/README.md" | cut -d" " -f2- | tr -d "\n")
	absolute_path=$(cut -c 2- <<<"$indexdir")
	printf "* [%s](%s) %s\n" "$blog_title" "$absolute_path" "$blog_date"
done< <(find ./post -name "README.md" | sed "s/README.md$//g" ); } \
  | python -c "import sys; print(''.join(sorted(sys.stdin.readlines(), key=lambda l: l.split()[-1], reverse=True)))"
  # python expression sort lines by last column
```