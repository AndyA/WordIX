package WordIX::Rack;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::Rack - A rack, or bag of tiles

=cut

use List::Util qw( shuffle );

has _tiles => (
  traits   => ['Array'],
  is       => "ro",
  isa      => "ArrayRef",
  required => 1,
  default  => sub { [] },
  handles  => {
    add     => "push",
    size    => "count",
    tiles   => "elements",
    _splice => "splice",
    get     => "get",
  },
);

sub pick {
  my ( $self, $idx ) = @_;
  return if $idx >= $self->size;
  return $self->_splice( $idx, 1 );
}

sub put {
  my ( $self, $idx, @tile ) = @_;
  die "Bad rack index" if $idx > $self->size;
  $self->_splice( $idx, 0, @tile );
}

sub take {
  my ( $self, $num ) = @_;
  my @sel = shuffle 0 .. $self->size - 1;
  return shuffle map { $self->pick($_) }
   sort { $b <=> $a } splice @sel, 0, $num;
}

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
