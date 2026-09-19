#!/bin/sh
# 사용법: ./new-post.sh "글 제목" [영문-slug]
# 오늘(서울 시간) 날짜로 _posts/ 에 새 글 파일을 만든다. 날짜는 파일명에서 자동으로 쓰인다.
set -e
[ -n "$1" ] || { echo "사용법: $0 \"글 제목\" [slug]"; exit 1; }
cd "$(dirname "$0")"
day=$(TZ=Asia/Seoul date +%F)
slug=${2:-$(TZ=Asia/Seoul date +%H%M%S)}
file="_posts/$day-$slug.md"
[ ! -e "$file" ] || { echo "이미 있음: $file"; exit 1; }
printf -- '---\nlayout: post\ntitle: "%s"\n---\n\n' "$1" > "$file"
echo "$file"
