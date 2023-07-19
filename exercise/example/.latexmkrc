#!/usr/bin/perl

$pdf_mode = 4;
$out_dir = 'build';

set_tex_cmds('--shell-escape -synctex=1 -interaction=nonstopmode %O %S');
