#!/bin/bash

git checkout gh-pages &&
git checkout master -- docs &&
cd docs &&
mkdocs build &&
cd .. &&
mv -f docs/site/* ./ &&
rm -rf docs &&
git add . -A &&
git commit -m "$1" &&
git push &&
git checkout master