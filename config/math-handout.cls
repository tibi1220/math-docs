% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-handout}]
\ProvidesClass{math-handout}

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
\LoadClass[a4paper, 12pt]{scrartcl}

% Provided packages
\RequirePackage[\@@lang]{babel}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-tikz}
\RequirePackage[print-solutions]{math-exercise}
