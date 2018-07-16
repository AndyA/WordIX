#!/usr/bin/env perl

use v5.10;

use autodie;
use strict;
use warnings;

use WordIX::Rack;

has rack => (
  is       => "ro",
  isa      => "WordIX::Rack",
  required => 1,
  default  => sub { WordIX::Rack->new }
);

# vim:ts=2:sw=2:sts=2:et:ft=perl

