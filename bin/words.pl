#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use lib qw( lib );

use JSON ();
use List::Util qw( shuffle min max );
use Path::Class;
use WordIX::Board;
use WordIX::Board::Tile;
use WordIX::Board::WildTile;
use WordIX::Rack;
use WordIX::Words;

use constant DICT => file "ref/dict.txt";

my @words = DICT->slurp( chomp => 1 );
my $d = WordIX::Words->new( words => \@words );

my $rack = WordIX::Rack->new;

$rack->add(
  WordIX::Board::Tile->new( letter => "E", score => 1 ),
  WordIX::Board::Tile->new( letter => "X", score => 8 ),
  WordIX::Board::Tile->new( letter => "T", score => 1 ),
  WordIX::Board::Tile->new( letter => "E", score => 1 ),
  WordIX::Board::Tile->new( letter => "N", score => 1 ),
  WordIX::Board::Tile->new( letter => "D", score => 2 ),
  WordIX::Board::Tile->new( letter => "C", score => 3 ),
);

for ( 1 .. 2 ) {
  say "Finding words";
  $d->find_words(
    $rack,
    [(undef) x 15],
    sub {
      my $path = shift;
      say join "", map { $_->letter } @$path;
    }
  );
}

# vim:ts=2:sw=2:sts=2:et:ft=perl

