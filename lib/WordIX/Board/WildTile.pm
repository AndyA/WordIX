package WordIX::Board::WildTile;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::Board::WildTile - A blank tile

=cut

has letter => (
  is  => "rw",
  isa => "Str",
);

sub score { 0 }

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
