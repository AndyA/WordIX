#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use lib qw( lib );

use JSON ();
use Path::Class;
use WordIX::Words;

use constant DICT => file "ref/dict.txt";

my @words = DICT->slurp( chomp => 1 );
my $d = WordIX::Words->new( words => \@words );

my $trie = $d->trie;

# vim:ts=2:sw=2:sts=2:et:ft=perl
