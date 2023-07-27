# Math documents

## Repo structure

The repo contains 4 primary latex directories:

```
│
├── .github  -- Workflow files
│
├── scripts  -- Typescript files - only used in workflows
│
├── config   -- LaTeX class and style files
│
├── book     -- LaTeX root files - longer
├── handout  -- LaTeX root files - shorter
│
├── exercise -- LaTeX standalone files - single exercises
└── graphics -- LaTeX standalone files - single graphics
```

### Config files

Config files are in the config folder. These files are used in the document
preambles. In order to use these files, they have to be copied or linked to a
location known to `texlive`. Running the following script takes care of this:

```shellscript
./link.sh
```

#### Motivation

Using the same config files in all of our `tex` source files helps us using
consistent notations throughout our documents. They also make life easier when
it comes to changing the styling of a specific element, because this way the
change only has to be made in one location.

#### Class files

For each filetype, we have custom `class` files. You should begin the documents
like this:

```latex
% Files in the book directory
\documentclass{math-book}

% Files in the handout directory
\documentclass{math-handout}

% Files in the exercise directory
\documentclass[exercise]{math-standalone}

% Files in the graphics directory
\documentclass[graphics]{math-standalone}
```

#### Style files

We also have custom `style` files. These files are already included in the
`class` files, so you do not need to worry about importing them. They provide
some useful environments or command, like these:

```latex
% Used for regular vectors
\rvec{u}

% Used for unit vectors
\uvec{v}

% Used for dot product
\dprod{u}{v}
```

### Non config files

Besides `config` files, we have 4 different `tex` source file types

- Standalone files
  - `graphics` files contain a single figure.
  - `exercise` files each contain one exercise.
- Root files
  - `handout` files contain approximately 45 minutes worth of information.
  - `book` files contain more information

## Folder structure

Each folder containing `root` or `standalone` files most contain the following
files:

- `config.yml`

<!-- prettier-ignore -->
```yaml
root_files:
  - input: main  # Required
  - output:      # Undefined by default
  - lang:        # Undefined by default
out_dir: true    # Can be boolean or string (true - infer, false - fallback, string - force value)
out_file: true   # Can be true or false (true - infer, false - fallback)
lang: true       # Can be boolean or string (true - infer, false - off, string - force value)
external_deps:   # Undefined by default
  program_name:
    - dep1
    - dep2
```

- `.latexmkrc`

```perl
#!/usr/bin/perl

$pdf_mode = 4;
$out_dir = 'build';

set_tex_cmds('--shell-escape -synctex=1 -interaction=nonstopmode %O %S');
```

## Contribution

### Cloning the repo

If you have the github cli `gh` installed, clone the repo by the following
command:

```shellscript
gh repo clone tibi1220/math-docs
```

If you do not, use the default `git` command. It is already installed on MacOS:

```shellscript
git clone git@github.com:tibi1220/math-docs.git
```

### Dependencies

Install [MacTeX](https://www.tug.org/mactex/mactex-download.html).

After installation, you will need to get `latexindent` working.

- You can either install `latexindent` with [`brew`](https://brew.sh/) by
  running the following script:

```shellscript
brew install latexindent
```

- Or you can manually install the `perl` modules by using the
  [`cpanm`](https://metacpan.org/dist/App-cpanminus/view/bin/cpanm) package
  manager:

```
cpanm YAML::Tiny
cpanm File::HomeDir
```

### Recommended plugins

#### Neovim

You can check out my neovim configuration
[here](https://github.com/tibi1220/nvim-config).

Some of the most important plugins when working with latex:

- [`nvim-lspconfig`](https://github.com/neovim/nvim-lspconfig) - lsp config
- [`mason`](https://github.com/williamboman/mason.nvim) - installation
- [`vimtex`](https://github.com/lervag/vimtex) - latex compilation
- [`null-ls`](https://github.com/jose-elias-alvarez/null-ls.nvim) - formatting

#### VS Code

The most essential plugins I recommend are:

- [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
- [LaTeX Utilities](https://marketplace.visualstudio.com/items?itemName=tecosaur.latex-utilities)

The recommended settings are:

<!-- prettier-ignore -->
```jsonc
{
  // ...
  // Format on save / paste
  "[tex,sty,cls]": { 
    "editor.defaultFormatter": "James-Yu.latex-workshop",
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true
  },
  // I like these stats :)
  "latex-utilities.countWord.format": "${words} words, ${math} eq",
  // Very important !!! 
  // This way, our local .latexmkrc files will be used during compilation
  "latex-workshop.latex.recipe.default": "latexmk (latexmkrc)",
  // Formatting
  "latex-workshop.latexindent.args": [
    "-l",
    "%WORKSPACE_FOLDER%/latexindent.yaml",
    "-c",
    "%DIR%/",
    "%TMPFILE%"
  ],
  // ...
}
```

These settings and extensions are already included in the repo, so if you are
using VS Code, there is no need to change anything in your config.
