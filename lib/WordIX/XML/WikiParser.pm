package WordIX::XML::WikiParser;

our $VERSION = "0.01";

use v5.10;

use Moose;

=head1 NAME

WordIX::XML::WikiParser - parse words from mediawiki dump

=cut

has _stack => (
  is      => 'ro',
  isa     => 'ArrayRef',
  default => sub { [] }
);

has _page => (
  is      => 'rw',
  isa     => 'ArrayRef',
  default => sub { [] }
);

has text => (
  is       => 'ro',
  isa      => 'CodeRef',
  required => 1
);

sub start_element {
  my ( $self, $info ) = @_;
  my $st = $self->_stack;
  push @$st, $info;
}

sub end_element {
  my ( $self, $info ) = @_;
  my $st       = $self->_stack;
  my $top_info = pop @$st;
  die "Bad nesting"
   unless $info->{LocalName} eq $top_info->{LocalName};
  if ( $info->{LocalName} eq "page" ) {
    $self->text->( join "", @{ $self->_page } );
    $self->_page( [] );
  }
}

sub characters {
  my ( $self, $info ) = @_;
  my $st = $self->_stack;
  if ( $st->[-1]{LocalName} eq "text" ) {
    push @{ $self->_page }, $info->{Data};
  }
}

no Moose;
__PACKAGE__->meta->make_immutable;

# vim:ts=2:sw=2:sts=2:et:ft=perl
