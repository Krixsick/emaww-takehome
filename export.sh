#!/usr/bin/env bash
set -euo pipefail

usage() {
    echo "Usage: ./export.sh [-v] /path/to/xml" >&2
}

verbose=false

while getopts ":v" option; do
    case "$option" in
        v) verbose=true ;;
        *) usage; exit 2 ;;
    esac
done

shift "$((OPTIND - 1))"

if [ "$#" -ne 1 ]; then
    usage
    exit 2
fi

input_file="$1"

if [ ! -f "$input_file" ] || [ ! -r "$input_file" ]; then
    echo "Error: XML file does not exist or is not readable: $input_file" >&2
    exit 1
fi

# Resolve the input path relative to where the user ran this script.
export XML_FILE="$(cd "$(dirname "$input_file")" && pwd)/$(basename "$input_file")"

# Locate compose.yaml beside this script.
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build the arguments passed to the TypeScript application.
if [ "$verbose" = true ]; then
    set -- -v /input/config.xml
else
    set -- /input/config.xml
fi

exec docker compose \
    --project-directory "$script_dir" \
    -f "$script_dir/compose.yaml" \
    run --build --rm -T app "$@"