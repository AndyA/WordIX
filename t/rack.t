#!perl

use strict;
use warnings;
use Test::More;

use WordIX::Rack;
use WordIX::Tile;
use WordIX::WildTile;

my $rack = WordIX::Rack->new;
is $rack->size, 0, "empty rack";
ok !defined $rack->pick(0),  "empty (0) -> undef";
ok !defined $rack->pick(10), "empty (10) -> undef";

$rack->add(
  WordIX::Tile->new( letter => "C", score => 1 ),
  WordIX::Tile->new( letter => "A", score => 1 ),
  WordIX::WildTile->new(),
  WordIX::Tile->new( letter => "B", score => 1 ),
  WordIX::Tile->new( letter => "B", score => 1 ),
  WordIX::Tile->new( letter => "C", score => 1 ),
  WordIX::Tile->new( letter => "A", score => 1 ),
  WordIX::WildTile->new(),
);

is $rack->size, 8, "rack has 8 tiles";

my $all_tiles = get_rack($rack);
is $all_tiles, "CA*BBCA*", "rack has expected tiles";
my $tile = $rack->pick(5);
is get_rack($rack), "CA*BBA*", "rack has expected tiles after pick";
is $tile->letter, "C", "expected tile picked";
$rack->put( 2, $tile );
is get_rack($rack), "CAC*BBA*", "rack has expected tiles after put";

my @got = $rack->take(3);
is scalar(@got), 3, "got 3 random tiles";
is $rack->size, 5, "rack has 5 tiles";

my $rack_tiles = get_rack($rack);
my $got_tiles = join "", map { $_ // "*" } map { $_->letter } @got;

is sort_chars( $rack_tiles . $got_tiles ), sort_chars($all_tiles),
 "$rack_tiles + $got_tiles = $all_tiles";

my @got2 = $rack->take(8);
is scalar(@got2), 5, "got 5 more random tiles";
is $rack->size, 0, "rack is empty";

done_testing;

sub sort_chars {
  join "", sort { $a cmp $b } split //, join "", @_;
}

sub get_rack {
  my $rack = shift;
  return join "", map { $_ // "*" } map { $_->letter } $rack->tiles;
}

# vim:ts=2:sw=2:et:ft=perl

