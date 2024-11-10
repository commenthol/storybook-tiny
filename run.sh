#!/usr/bin/env bash

set -eo pipefail

CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd "$CWD"

function run {
	echo run
}

# ... general ...

function _packages {
	ls -1 "$CWD"/packages
}

function _c4u {
	local p=$(_packages) 
	for d in $p; do
		pushd "$CWD"/packages/$d
		c4u -F "@storybook-tiny" $@
		popd > /dev/null
	done
	pnpm i
}

function _test {
	local p=$(_packages | grep -v setup)
	echo 'press "q + Enter" to get to the next storybook'
	for d in $p; do
		pushd "$CWD"/packages/$d
		npm run dev
		popd > /dev/null
	done
}

# ... ignition ...

function help {
	# declare -F does not works in zsh!
	declare -F | sed -e 's/declare -f /    /; /    _[a-z]/d'
}

if test -z "$1"; then
	help
else
	$1 ${*:2}
fi
