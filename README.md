[![Build Status](https://travis-ci.org/vovka/cloaked-batman.svg?branch=master)](https://travis-ci.org/vovka/cloaked-batman)
cloaked-batman
==============

## Frequent abbreviations.
* PR - pull request.

## How to get done with pull requests quick and painless? 

###Before push check the next points in your commits:
_1. Your code style is good.

> 
  1. You have no commented out lines of code. 
  2. You have two spaces indentations.
  3. You don't have unnecessary empty lines.
    1. You should have one empty line between method definitions. 
    2. You can divide logical parts of code with one empty line.
  4. You have one new line in the end of file. 

_2. You have committed proper files. 

>
  1. Your commit contains necessary files related to your feature ONLY. For example, if you do feature about Products you MUST NOT commit changes regarding tests for Stores feature etc.
  2. You didn't commit custom and temporary - compiled assets, uploaded images, /tmp folder, config files etc. Here could be exceptions, for example if you add some seed data you may add uploaded files. 

_3. Tests pass. 

> Run ALL tests before push. 

_4. Your branch contains only one feature. 

> One feature - one branch - one pull request

### After push check:
_1. Your branch is green. 

> 
It means all tests pass. You can check status [on branches page](https://github.com/vovka/cloaked-batman/branches) or directly [on Travis](https://travis-ci.org/vovka/cloaked-batman). 

_2. Your branch can be automatically merged. 

> 
You can check it when create a PR: ![](https://gist.githubusercontent.com/vovka/947896547dde1c4a1d9c/raw/d0b4b3ca9fba66907e76978e009a326bcf9e7c52/able%20to%20merge.png). If it can't be - deal with it:
* Merge fresh master into your branch. 
* Or create new branch from fresh master and merge your branch into there. 
* Or any other proper way. 



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/vovka/cloaked-batman/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

