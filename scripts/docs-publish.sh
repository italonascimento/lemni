#!/bin/bash

npm run docs:build

git checkout gh-pages
git checkout -- docs/site
mv docs/site/**/* ./
rm -rf docs
git add . -A
git commit -m "$1"
git checkout master