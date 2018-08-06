#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use lib qw( lib );

use File::Find;
use JSON ();
use Path::Class;

$| = 1;

STDOUT->binmode(":utf8");

=for ref

<doc id="57943569" url="https://en.wikipedia.org/wiki?curid=57943569" title="Ephraim Bagenda">

=cut

my ( $words, @src ) = @ARGV;

say "Loading dictionary $words";
my $stats
 = { map { $_ => { freq => 0, articles => 0 } } load_dict($words) };

find {
  wanted => sub {
    return unless -f;
    my $file = $_;
    say "Reading $file";
    load_articles(
      $file,
      sub {
        my ( $title, @txt ) = @_;
        scan_article( $stats, $title, @txt );
      }
    );
  },
  no_chdir => 1
}, @src;

my @by_freq
 = map { $_->[0] }
 sort  { $a->[1] <=> $b->[1] }
 map { [$_, $stats->{$_}{freq}] } keys %$stats;

for my $word (@by_freq) {
  my $st = $stats->{$word};
  say join ",", $word, $st->{freq}, $st->{articles};
}

sub scan_article {
  my ( $stats, $title, @txt ) = @_;
  # say $title;
  my %wc = ();
  for my $word ( map { clean_word($_) } map { split /\s+/ } @txt ) {
    my $st = $stats->{$word};
    next unless $st;
    $st->{freq}++;
    $wc{$word}++;
  }
  $stats->{$_}{articles}++ for keys %wc;
}

sub clean_word {
  my $word = shift;
  $word =~ s/[)"'.,;:?]+$//;
  $word =~ s/^[("']+//;
  return () unless $word =~ /^[a-z]{2,}$/i;
  return uc $word;
}

sub load_articles {
  my ( $file, $cb ) = @_;
  my ( $in_doc, @doc );
  for my $ln ( file($file)->slurp ) {
    if ( $ln =~ /^\<doc\s+id="\d+"\s+url=".+?"\s+title="(.+?)">/ ) {
      $in_doc = $1;
      # say "  $in_doc";
      next;
    }
    if ( defined $in_doc ) {
      if ( $ln =~ m{^</doc>} ) {
        $cb->( $in_doc, splice @doc ) if @doc;
        undef $in_doc;
        next;
      }
      push @doc, $ln;
    }
  }
}

sub load_dict {
  my $words = file(shift)->slurp;
  return map uc, split /\s+/, $words;
}

# vim:ts=2:sw=2:sts=2:et:ft=perl
