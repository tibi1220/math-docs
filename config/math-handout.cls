% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-handout}]
\ProvidesClass{math-handout}

% Default class options
\PassOptionsToClass{a4paper, 12pt}{scrartcl}

% Class options
\RequirePackage{kvoptions}

\SetupKeyvalOptions{family=handout,prefix=handout@@}

\DeclareStringOption[magyar]{lang}
\DeclareDefaultOption{
  \AtEndOfClass{\PassOptionsToClass{\CurrentOption}{scrartcl}}
}

\ProcessKeyvalOptions*

% Based on this class
\LoadClass{scrartcl}

% Provided packages
\RequirePackage[\handout@@lang]{babel}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-graphics}
\RequirePackage[print-solutions]{math-exercise}
