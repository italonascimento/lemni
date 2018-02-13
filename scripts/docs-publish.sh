#!/bin/bash

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