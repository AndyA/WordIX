#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use lib qw( lib );

use JSON ();
use Path::Class;
use WordIX::XML::WikiParser;
use XML::SAX;

STDOUT->binmode(":utf8");

my $handler = WordIX::XML::WikiParser->new(
  text => sub {
    my $text = shift;
    say $text;
  }
);

my $parser = XML::SAX::ParserFactory->parser( Handler => $handler );

$parser->parse_file(*STDIN);

# vim:ts=2:sw=2:sts=2:et:ft=perl
