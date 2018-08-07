#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use DBI;
use Getopt::Long;
use JSON ();
use Path::Class;

use constant CHUNK => 1000;
use constant USAGE => <<EOT;
Usage: $0 [options] <file>...

Options:
  --name <source name>    Source name (required)
  --desc <source desc>    Source description
EOT

my %O = (
  name => undef,
  desc => ""
);

GetOptions(
  'name:s' => \$O{name},
  'desc:s' => \$O{desc}
) or die USAGE;

die USAGE unless defined $O{name};

# Load the words
my %seen = ();
for my $src (@ARGV) {
  $seen{$_}++
   for map { uc } grep { /^[a-z]{2,}$/i } split /\s+/,
   scalar file($src)->slurp;
}
my @words = sort keys %seen;
say "Loading ", scalar(@words), " words";

my $db
 = DBI->connect(
  sprintf( 'DBI:mysql:database=%s;host=%s', 'wordix', 'localhost' ),
  'root', '', { RaiseError => 1 } );

my $source_id = get_source( $db, $O{name}, $O{desc} );
my $word_ids = get_word_ids( $db, @words );

$db->do( "DELETE FROM `source_word` WHERE `source_id` = ?",
  {}, $source_id );

while (@words) {
  my @chunk = splice @words, 0, CHUNK;
  insert(
    $db,
    "source_word",
    map {
      { source_id => $source_id,
        word_id   => $word_ids->{$_} // die "No ID for $_",
        frequency => 1
      }
    } @chunk
  );
}

$db->disconnect;

sub get_word_ids {
  my ( $db, @words ) = @_;

  my @missing = ();
  my $id_map  = {};

  while (@words) {
    my @chunk = splice @words, 0, CHUNK;
    my $word_ids = load_word_ids( $db, @chunk );
    push @missing, grep { !$word_ids->{$_} } @chunk;
    $id_map->{$_} = $word_ids->{$_} for keys %$word_ids;
  }

  while (@missing) {
    my @chunk = splice @missing, 0, CHUNK;
    insert( $db, "words", map { { word => $_ } } @chunk );
    my $word_ids = load_word_ids( $db, @chunk );
    $id_map->{$_} = $word_ids->{$_} for keys %$word_ids;
  }

  return $id_map;
}

sub load_word_ids {
  my ( $db, @words ) = @_;

  my $res = $db->selectall_arrayref(
    join( " ",
      "SELECT * FROM `words`",
      "WHERE `word` IN (",
      join( ", ", map "?", @words ),
      ")" ),
    { Slice => {} },
    @words
  );

  return { map { $_->{word} => $_->{id} } @$res };
}

sub get_source {
  my ( $db, $name, $desc ) = @_;
  my $parent = undef;
  my @path = map { { name => $_, desc => '' } } split '/', $name;
  $path[-1]{desc} = $desc;

  for my $step (@path) {
    my ($id) = $db->selectrow_array(
      join( " ",
        "SELECT `id` FROM `source`",
        " WHERE `name` = ?",
        "   AND `parent`",
        ( $parent ? " = ?" : "IS NULL" ) ),
      {},
      $step->{name},
      ( $parent ? ($parent) : () )
    );

    unless ($id) {
      insert(
        $db, "source",
        { name        => $step->{name},
          description => $step->{desc},
          parent      => $parent
        }
      );
      $id = $db->last_insert_id( undef, undef, undef, undef );
    }
    $parent = $id;
  }
  return $parent;
}

sub insert {
  my ( $db, $table, @data ) = @_;
  return unless @data;
  my @keys   = sort keys %{ $data[0] };
  my $values = "(" . join( ", ", map "?", @keys ) . ")";
  my $sql    = join ' ',
   "INSERT INTO `$table` (", join( ", ", map "`$_`", @keys ), ")",
   "VALUES", join( ", ", ($values) x @data );
  $db->do( $sql, {}, map { @{$_}{@keys} } @data );
}

# vim:ts=2:sw=2:sts=2:et:ft=perl
