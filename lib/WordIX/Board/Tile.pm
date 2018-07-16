package WordIX::Board::Tile;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::Board::Tile - A letter tile

=cut

has letter => (
  is       => "ro",
  isa      => "Str",
  required => 1,
);

has score => (
  is       => "ro",
  isa      => "Int",
  required => 1,
);

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
