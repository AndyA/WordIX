#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

has board => (
  is       => "ro",
  isa      => "WordIX::Board",
  required => 1,
);

has words => (
  is       => "ro",
  isa      => "WordIX::Words",
  required => 1,
);

has rack => (
  is       => "ro",
  isa      => "WordIX::Rack",
  required => 1,
);

has _done => (
  is      => "ro",
  isa     => "HashRef",
  default => sub { {} }
);

sub _try_position {
  my ( $self, $cb, $x, $y, $dx, $dy, $cb ) = @_;

  my $board = $self->board;
  my $used  = $board->used;

  return
      unless $used
   || $x == $board->startx
   || $y == $board->starty;

  my ( $ox, $oy ) = ( $x, $y );

  # Move back over any occupied cells
  while () {
    my ( $nx, $ny ) = ( $ox - $dx, $oy - $dy );
    last if $nx < 0 || $ny < 0;
    last unless defined $board->tile( $nx, $ny );
    ( $ox, $oy ) = ( $nx, $ny );
  }

  return if $self->_done->{"$ox,$oy"}++;

  # Find any fixed letters
  my @fixed = ();
  while ( $ox < $board->width && $oy < $board->height ) {
    push @fixed, $board->tile( $ox, $oy );
    $ox += $dx;
    $oy += $dy;
  }

  $self->words->find_words(
    $self->rack,
    \@fixed,
    sub {
      my $path = shift;
    }
  );
}

sub try_position {
  my ( $self, $x, $y, $cb ) = @_;
  $self->_try_position( $cb, $x, $y, 1, 0 );
  $self->_try_position( $cb, $x, $y, 0, 1 );
}

# vim:ts=2:sw=2:sts=2:et:ft=perl

