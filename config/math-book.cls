% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-book}]
\ProvidesClass{math-book}

% Class options
\RequirePackage{xkeyval}

\newcommand\@@lang{}

\DeclareOptionX{lang}{\renewcommand\@@lang{#1}}
\ExecuteOptionsX{lang=magyar}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{scrbook}}

% End of options
\ProcessOptionsX\relax
\ProcessOptions\relax

% Based on this class
\LoadClass[a4paper, 12pt]{scrbook}

% Provided packages
\RequirePackage[\@@lang]{babel}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-graphics}
\RequirePackage[print-solutions]{math-exercise}
