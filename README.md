# Math documents

## Repo structure

The repo contains 4 primary latex directories:

```
├── config      -- Config files
├── exercise    -- Exercise files
├── root_file   -- Root files
└── standalone  -- Standalone files
```

### Config files

Config files are in the config folder. These files are used in the document
preambles.

#### Motivation

Using the same config files in all of our `tex` source files helps us using
consistent notations through our documents. They also make life easier, if we
want to change the appearance of a desired element, because the style only needs
to be changed in the config files this way.

#### Class files

For each filetype, we have custom `class` files. You should begin the documents
like this:

```latex
% Files in the root_file directory
\documentclass{math-root}

% Files in the exercise directory
\documentclass{math-exercise}

% Files in the standalone directory
\documentclass{math-standalne}
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

Besides `config` files, we have 3 different `tex` source file types

- `standalone` files are files that contain mainly graphics, that can be reused
  in different other files.
- `exercise` files each contain one exercise.
- `root_file` files are basically files that bundle exerceses and standalone
  files.

## Contribution

If you have the github cli `gh` installed, clone the repo by the following
command:

```shellscript
gh repo clone tibi1220/math-docs
```

If you do not, use the default `git` command. It is already installed on MacOS:

```shellscript
git clone git@github.com:tibi1220/math-docs.git
```

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

The first one is much easier, trust me.

After the installation, you need to configure your editor to auto format `latex`
documents on save.

You also need to configure your editor to use the `.latexmkrc` files during
compilation.

It is also required to run the `config.sh` script to move the custom class files
to the correct directories.
