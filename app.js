#!/usr/bin/env node
process.title = "[Lob&Tadel]Web";

/*
 * webserver
 */

var Risotto = new require('./risotto');

Risotto.initialize(__dirname);
Risotto.listen();