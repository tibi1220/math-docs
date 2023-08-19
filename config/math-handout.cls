% TeX format requirement
\NeedsTeXFormat{LaTeX2e}

% Class name [\documentclass{math-handout}]
\ProvidesClass{math-handout}

% Default class options
\PassOptionsToClass{a4paper, 12pt, toc=sectionentrywithdots}{scrartcl}

% Class options
\RequirePackage{kvoptions}

\SetupKeyvalOptions{family=handout,prefix=handout@@}

\DeclareStringOption[magyar]{lang}
\DeclareBoolOption[false]{debug}
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
\RequirePackage{standalone}

% Page layout
\ifhandout@@debug
  \PassOptionsToPackage{showframe}{geometry}
\fi
\RequirePackage[margin=.8in,footskip=.6in]{geometry}

\setlength\parindent{0em}
\setlength\parskip{.5em}

\newcommand{\area}[1]{\def\@area{#1}}
\newcommand{\docno}[1]{\def\@docno{#1}}
\renewcommand{\subject}[1]{\def\@subject{#1}}

\RequirePackage{lastpage}
\RequirePackage[headsepline=1mm,footsepline=1mm]{scrlayer-scrpage}
\pagestyle{scrheadings}
\setkomafont{pageheadfoot}{\color{gray}}
\ModifyLayer[addvoffset=-2mm]{scrheadings.foot.above.line}
\cfoot{\thepage\ / \pageref{LastPage}}
\ihead{\@subject}
\ohead{\@area\ -- \@title}

\renewcommandx{\maketitle}[1][1=]{%
  \bgroup%
  \sffamily%
  \hspace*{.33em}
  \begin{tikzpicture}
    \node[fill=blue-base, text=white, rounded corners=2mm, inner sep=3mm, scale=1.2, align=center] (docno) {%
      \Huge\bfseries\@docno\\[5mm]%
    };
    \node[text=blue-base, anchor=north west, inner sep=3mm, scale=1.2, align=left] at ($(docno.north east)+(5mm,0)$) (title) {%
      \hspace*{-3mm}\huge\bfseries\@title\hspace*{-3mm}\\[-1.05em]%
    };
    \node[text=gray, anchor=south west, inner sep=0, align=left] at ($(docno.south east)+(5mm,1.5mm)$) (rest) {%
      \bfseries\@subject\ -- \@area\\[1mm]
      \bfseries\@date%
    };
    \draw[gray, ultra thick] ($(rest.south west)-(0,1.0mm)$) -- ($(rest.south east)-(0,1.0mm)$);
    \draw[gray, ultra thick] ($(rest.north west)+(0,1.5mm)$) -- ($(rest.north east)+(0,1.5mm)$);

    % \draw[gray, ultra thick] ($(rest.south west)-(0,1.0mm)$) coordinate (T) -- ($(current page text area.north east |- T)-(2mm,0)$);
    % \draw[gray, ultra thick] ($(rest.north west)+(0,1.5mm)$) coordinate (T) -- ($(current page text area.north east |- T)-(2mm,0)$);
  \end{tikzpicture}
  % \Huge\bfseries\color{blue-base}\@title\\[1mm]
  % \large\color{gray}\@area\ \@docno\\[1mm]
  % \mdseries\footnotesize\color{gray}\@date\\[2em]
  \egroup%
}

\newenvironment{summary}{\bgroup\sffamily\large\color{gray}}{\egroup}

% Exerciser grouping
\newcommand\listofexercises{%
  \listoftoc[Alma]{lox}
}

% Counters
\refstepcounter{section}
\numberwithin{definition}{section}
\numberwithin{exercise}{section}
\numberwithin{note}{section}
\let\section\subsection
