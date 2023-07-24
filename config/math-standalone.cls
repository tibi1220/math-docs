% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-standalone}]
\ProvidesClass{math-standalone}

% Ifs for option processing
\newif\if@@exercise
\@@exercisefalse
\newif\if@@keepspace
\@@keepspacefalse

% Process class options
\RequirePackage{xkeyval}

\DeclareOption{graphics}{\OptionNotUsed}
\DeclareOption{exercise}{%
  \PassOptionsToClass{varwidth=18cm}{standalone}%
  \@@exercisetrue
}

\DeclareOption{print-solutions}{%
  \PassOptionsToPackage{\CurrentOption}{math-exercise}
}
\DeclareOption{keep-space}{%
  \PassOptionsToPackage{\CurrentOption}{math-exercise}%
  \@@keepspacetrue%
}

\newcommand\@@lang{}
\DeclareOptionX{lang}{\renewcommand\@@lang{#1}}
\ExecuteOptionsX{lang=magyar}

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{standalone}}

% End of otions
\ProcessOptionsX\relax
\ProcessOptions\relax

% Based on this class
\LoadClass[12pt, margin=5mm]{standalone}

% Provided packages
\RequirePackage[\@@lang]{babel}

\if@@keepspace\else
  \PassOptionsToPackage{print-solutions}{math-exercise}
\fi
\if@@exercise
  \RequirePackage{math-exercise}
\fi

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-graphics}
