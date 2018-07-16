package WordIX::Board;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::Board - A word game board

=cut

has ['width', 'height'] => (
  is       => "ro",
  isa      => "Int",
  required => 1,
  default  => 15
);

has startx => (
  is      => "ro",
  isa     => "Int",
  lazy    => 1,
  builder => '_b_startx'
);

has starty => (
  is      => "ro",
  isa     => "Int",
  lazy    => 1,
  builder => '_b_starty'
);

has cells => (
  is      => "ro",
  isa     => "ArrayRef[ArrayRef[Any]]",
  lazy    => 1,
  builder => "_b_cells"
);

sub _b_startx { int( shift->width / 2 ) }
sub _b_starty { int( shift->height / 2 ) }

sub _b_cells {
  my $self = shift;
  return [map { [(undef) x $self->width] } 1 .. $self->height];
}

sub cell {
  my $self = shift;
  my $x    = shift;
  my $y    = shift;

  die "Cell X, Y out of range"
   if $x < 0 || $x >= $self->width || $y < 0 || $y >= $self->height;

  return $self->cells->[$y][$x] unless @_;

  $self->cells->[$y][$x] = shift;
  return $self;
}

sub used {
  my $self = shift;
  my @used = grep { defined } map { @$_ } @{ $self->cells };
  return scalar @used;
}

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
