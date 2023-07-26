% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-standalone}]
\ProvidesClass{math-standalone}

% Default class options
\PassOptionsToClass{12pt, margin=5mm}{standalone}

% Process class options
\RequirePackage{kvoptions}

\SetupKeyvalOptions{family=standalone,prefix=standalone@@}

\DeclareStringOption[magyar]{lang}
\DeclareBoolOption{graphics}
\DeclareBoolOption{exercise}
\DeclareBoolOption{nosolutions}

\DeclareDefaultOption{
  \AtBeginOfClassFile{\PassOptionsToClass{\CurrentOption}{standalone}}
}

\ProcessKeyvalOptions*

% Based on this class
\ifstandalone@@exercise
  \PassOptionsToClass{varwidth=18cm}{standalone}
\fi
\LoadClass{standalone}

% Provided packages
\RequirePackage[\standalone@@lang]{babel}

\ifstandalone@@nosolutions
  \PassOptionsToPackage{keep-space}{math-exercise}
\else
  \PassOptionsToPackage{print-solutions}{math-exercise}
\fi
\ifstandalone@@exercise
  \RequirePackage{math-exercise}
\fi

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-graphics}
