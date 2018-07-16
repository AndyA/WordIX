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
use WordIX::Tile;
use WordIX::WildTile;
use WordIX::Rack;
use WordIX::Words;

use constant DICT => file "ref/dict.txt";

my @score = (
  "T..words...T...words..T",            #
  ".D...t...t...D.",                    #
  "..D...words.words...D..",            #
  "words..D...words...D..words",        #
  "....D.....D....",                    #
  ".t...t...t...t.",                    #
  "..words...words.words...words..",    #
  "T......D......T",                    #
  "..words...words.words...words..",    #
  ".t...t...t...t.",                    #
  "....D.....D....",                    #
  "words..D...words...D..words",        #
  "..D...words.words...D..",            #
  ".D...t...t...D.",                    #
  "T..words...T...words..T",            #
);

my $board = WordIX::Board->new;

my %tiles = (
  A => { score => 1,  count => 9 },
  B => { score => 3,  count => 2 },
  C => { score => 3,  count => 2 },
  D => { score => 2,  count => 4 },
  E => { score => 1,  count => 12 },
  F => { score => 4,  count => 2 },
  G => { score => 2,  count => 3 },
  H => { score => 4,  count => 2 },
  I => { score => 1,  count => 9 },
  J => { score => 8,  count => 1 },
  K => { score => 5,  count => 1 },
  L => { score => 1,  count => 4 },
  M => { score => 3,  count => 2 },
  N => { score => 1,  count => 6 },
  O => { score => 1,  count => 8 },
  P => { score => 3,  count => 2 },
  Q => { score => 10, count => 1 },
  R => { score => 1,  count => 6 },
  S => { score => 1,  count => 4 },
  T => { score => 1,  count => 6 },
  U => { score => 1,  count => 4 },
  V => { score => 4,  count => 2 },
  W => { score => 4,  count => 2 },
  X => { score => 8,  count => 1 },
  Y => { score => 4,  count => 2 },
  Z => { score => 10, count => 1 },
  _ => { score => 0,  count => 2 },
);

my $bag = WordIX::Rack->new;
while ( my ( $letter, $spec ) = each %tiles ) {
  for ( 1 .. $spec->{count} ) {
    if ( $letter eq "_" ) {
      $bag->add( WordIX::WildTile->new );
    }
    else {
      $bag->add(
        WordIX::Tile->new(
          letter => $letter,
          score  => $spec->{score}
        )
      );
    }
  }
}

my @words = DICT->slurp( chomp => 1 );
my $words = WordIX::Words->new( words => \@words );

show_board($board);

exit;

my $rack = WordIX::Rack->new;

$rack->add(
  WordIX::Tile->new( letter => "E", score => 1 ),
  WordIX::Tile->new( letter => "X", score => 8 ),
  WordIX::Tile->new( letter => "T", score => 1 ),
  WordIX::Tile->new( letter => "E", score => 1 ),
  WordIX::Tile->new( letter => "N", score => 1 ),
  WordIX::Tile->new( letter => "D", score => 2 ),
  WordIX::Tile->new( letter => "C", score => 3 ),
);

for ( 1 .. 2 ) {
  say "Finding words";
  $words->find_words(
    $rack,
    [(undef) x 15],
    sub {
      my $path = shift;
      say join "", map { $_->{letter} } @$path;
    }
  );
}

sub show_board {
  my $board = shift;
  my $rule = "-" x ( $board->width * 4 - 3 );
  say $rule;
  for my $y ( 0 .. $board->height - 1 ) {
    say join " | ", map { $_ ? $_->letter : " " }
     map { $board->cell( $y, $_ ) } 0 .. $board->width - 1;
    say $rule;
  }
}

# vim:ts=2:sw=2:sts=2:et:ft=perl

