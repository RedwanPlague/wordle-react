#!/bin/bash

set -ex

hosting_path=/home/redwan/Documents/hosted-websites/wordle

npm run build

rm -rf ${hosting_path:?}/*
cp -r build/* $hosting_path

cd $hosting_path

git add -A
git commit
git push
