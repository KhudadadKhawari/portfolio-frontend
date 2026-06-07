#!/bin/sh
set -eu

export PORT="${NEXT_SERVER_PORT:-3001}"
export HOSTNAME="${NEXT_SERVER_HOSTNAME:-127.0.0.1}"

su-exec nextjs:nodejs node server.js &
next_pid="$!"

nginx -g "daemon off;" &
nginx_pid="$!"

shutdown() {
    kill -TERM "$nginx_pid" 2>/dev/null || true
    kill -TERM "$next_pid" 2>/dev/null || true
    wait "$nginx_pid" 2>/dev/null || true
    wait "$next_pid" 2>/dev/null || true
}

trap shutdown INT TERM

while :; do
    if ! kill -0 "$next_pid" 2>/dev/null; then
        wait "$next_pid"
        exit "$?"
    fi

    if ! kill -0 "$nginx_pid" 2>/dev/null; then
        wait "$nginx_pid"
        exit "$?"
    fi

    sleep 2
done