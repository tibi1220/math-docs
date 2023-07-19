#!/bin/bash

texmf=$(kpsewhich -var-value TEXMFHOME)

tex=$texmf/tex/latex/local

mkdir -p $tex

for file in config/*; do # config/file.cls
  f=$(basename $file)    # file.cls§
  b=${f%%.*}             # file

  rm -rf $tex/$b
  mkdir -p $tex/$b
  ln $file $tex/$b/$f
done

mktexlsr $tex
