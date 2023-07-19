\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{math-book}

\RequirePackage{expkv-opt,expkv-def}

% \begin{noindent}
\newcommand\@lang{english}
\ekvdefinekeys{math-book}{
  choice  lang  = {
    protected hu = \renewcommand\@lang{magyar},
    protected en = \renewcommand\@lang{english},
  },
	unknown code  = \PackageWarning{math-book}
                  {Unknown option `\detokenize{#1}' received `\detokenize{#2}'},
  unknown noval = \PackageWarning{mytheorem}{Unknown option `\detokenize{#1}'}
}

\ekvoProcessGlobalOptions{math-book}
\ekvoUseUnknownHandlers*
\ekvoProcessLocalOptions{math-book}

\RequirePackage[\@lang]{babel}

% \end{noindent}

\LoadClass[a4paper, 12pt]{scrbook}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-tikz}
\RequirePackage[print-solutions]{math-exercise}
