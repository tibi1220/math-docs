#!/bin/bash

# if macos
if [[ "$OSTYPE" == "darwin"* ]]; then
  tex=~/Library/texmf/tex/latex/local/
else
  tex=~/texmf/tex/latex/local/
fi

mkdir -p $tex

for file in config/*; do
  f=$(basename $file)
  b=${f%%.*}

  rm -rf $tex/$b
  mkdir -p $tex/$b
  ln $file $tex/$b/$f
done

mktexlsr $tex
