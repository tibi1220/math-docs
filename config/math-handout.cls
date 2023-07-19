\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{math-handout}

\RequirePackage{expkv-opt,expkv-def}

% \begin{noindent}
\newcommand\@lang{english}
\ekvdefinekeys{math-handout}{
  choice  lang  = {
    protected hu = \renewcommand\@lang{magyar},
    protected en = \renewcommand\@lang{english},
  },
	unknown code  = \PackageWarning{math-handout}
                  {Unknown option `\detokenize{#1}' received `\detokenize{#2}'},
  unknown noval = \PackageWarning{mytheorem}{Unknown option `\detokenize{#1}'}
}

\ekvoProcessGlobalOptions{math-handout}
\ekvoUseUnknownHandlers*
\ekvoProcessLocalOptions{math-handout}

\RequirePackage[\@lang]{babel}

% \end{noindent}

\LoadClass[a4paper, 12pt]{scrartcl}

\RequirePackage{math-util}
\RequirePackage{math-font}
\RequirePackage{math-math}
\RequirePackage{math-tikz}
\RequirePackage[print-solutions]{math-exercise}
