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

has trie => (
  is      => "ro",
  isa     => "HashRef",
  lazy    => 1,
  builder => "_b_trie",
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

sub _b_trie {
  my $self  = shift;
  my $words = $self->words;
  return $self->_b_trie_level( $self->words, 0, $#$words, 0 );
}

sub _b_trie_level {
  my ( $self, $words, $lo, $hi, $rank ) = @_;

  my ( %nlo, %nhi );
  for my $pos ( $lo .. $hi ) {
    my $word = $words->[$pos] . "*";
    next unless length $word > $rank;
    my $lt = substr $word, $rank, 1;
    $nlo{$lt} = $pos unless exists $nlo{$lt};
    $nhi{$lt} = $pos;
  }

  my $out = {};
  for my $lt ( sort keys %nlo ) {
    $out->{$lt}
     = $self->_b_trie_level( $words, $nlo{$lt}, $nhi{$lt}, $rank + 1 );
  }

  return $out;
}

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
