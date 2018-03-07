#!/bin/bash

if [ ! -z "$1" -a "$1" != " " ]; then
  git checkout gh-pages &&
  git checkout master -- docs &&
  cd docs &&
  mkdocs build &&
  cd .. &&
  rsync -a docs/site/* ./ --remove-sent-files --whole-file &&
  rm -rf docs &&
  git add . -A &&
  git commit -m "$1" &&
  git push &&
  git checkout master
else
  echo "😅 Please, specify a commit message."
fi