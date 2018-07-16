#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use lib qw( lib );

use Path::Class;
use WordIX::Words;
use List::Util qw( shuffle min max );

use constant DICT => file "ref/dict.txt";

my @words = DICT->slurp( chomp => 1 );
my $d = WordIX::Words->new( words => \@words );

my @try = qw(
 AACEGILOO
 AACEII
 AEKMNOOP
 AHNPRXY
 CGHII
 CHKMMO
 DEEMNO
 EELQRUY
 EGGI
 GIKNR
 HJKLMNO
);

my $idx = $d->index;

if (0) {
  my @pick = shuffle @$idx;
  say shift @pick for 1 .. 10;
  exit;
}

my $norm = $d->normalised;

for my $word (@try) {
  my $pos = $d->_find($word);

  say "$word: $pos";

  my $like = qr{^\Q$word};

  my @hit = grep { $idx->[$_] =~ $like } 0 .. $#$idx;

  for my $hit (@hit) {
    my @flag = ();
    push @flag, "hit" if $pos == $hit;
    printf "%8d %-3s %s %s %s\n", $hit, join( ", ", @flag ), $word,
     $idx->[$hit], $norm->{ $idx->[$hit] };
  }
  print "\n";
}

# vim:ts=2:sw=2:sts=2:et:ft=perl

