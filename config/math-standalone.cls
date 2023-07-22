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

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{standalone}}

% End of otions
\ProcessOptions\relax

% Based on this class
\LoadClass[12pt, margin=5mm]{standalone}

% Provided packages
\if@@keepspace\else
  \PassOptionsToPackage{print-solutions}{math-exercise}
\fi
\if@@exercise
  \RequirePackage{math-exercise}
\fi

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-tikz}
