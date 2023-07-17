#!/bin/bash

# if macos
if [[ "$OSTYPE" == "darwin"* ]]; then
  tex=~/Library/texmf/tex/latex/local/
else
  tex=~/texmf/tex/latex/local/
fi

mkdir -p $tex

cp -r config $tex/math-root
cp -r config $tex/math-root

cp -r config $tex/math-exercise
cp -r config $tex/math-exercise

cp -r config $tex/math-standalone
cp -r config $tex/math-standalone

mktexlsr $tex
