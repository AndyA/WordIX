package WordIX::Words;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::Words - A dictionary

=cut

has words => (
  is       => "ro",
  isa      => "ArrayRef",
  required => 1
);

has normalised => (
  is      => "ro",
  isa     => "HashRef",
  lazy    => 1,
  builder => "_b_normalised",
);

has index => (
  is      => "ro",
  isa     => "ArrayRef",
  lazy    => 1,
  builder => "_b_index",
);

sub _b_normalised {
  my $self = shift;
  my $norm = {};
  for my $word ( @{ $self->words } ) {
    my $nw = join "", sort { $a cmp $b } split //, $word;
    $norm->{$nw} = $word;
  }
  return $norm;
}

sub _b_index { [sort keys %{ shift->normalised }] }

sub _find {
  my ( $self, $prefix ) = @_;
  my $idx = $self->index;
  my $lo  = 0;
  my $hi  = @$idx;
  while ( $lo <= $hi ) {
    my $mid = int( ( $lo + $hi ) / 2 );
    my $cmp = $idx->[$mid] cmp $prefix;
    if ( $cmp < 0 ) {
      $lo = $mid + 1;
    }
    elsif ( $cmp > 0 ) {
      $hi = $mid - 1;
    }
    else {
      return $mid;
    }
  }
  return $lo;
}

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
