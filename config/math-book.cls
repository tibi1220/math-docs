% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-book}]
\ProvidesClass{math-book}

% Default class options
\PassOptionsToClass{a4paper, 12pt}{scrbook}

% Class options
\RequirePackage{kvoptions}

\SetupKeyvalOptions{family=book,prefix=book@@}

\DeclareStringOption[magyar]{lang}
\DeclareDefaultOption{
  \PassOptionsToClass{\CurrentOption}{scrbook}
}

\ProcessKeyvalOptions*

% Based on this class
\LoadClass{scrbook}

% Provided packages
\RequirePackage[\book@@lang]{babel}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-graphics}
\RequirePackage[print-solutions]{math-exercise}
