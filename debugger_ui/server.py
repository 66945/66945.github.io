#!/usr/bin/env python3
"""
Development HTTP server that permits iframe embedding from any origin.

Useful when you need to test how a page behaves embedded as an iframe
on several different sites during development.
"""

import argparse
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler


class IframeFriendlyHandler(SimpleHTTPRequestHandler):
    """Serves files with headers that permit iframe embedding from any origin."""

    def end_headers(self):
        # Permit framing by any origin.
        # CSP `frame-ancestors` is the modern control and supersedes
        # X-Frame-Options in browsers that support it. We deliberately
        # do NOT send X-Frame-Options so we don't accidentally block anything.
        self.send_header("Content-Security-Policy", "frame-ancestors *")

        # CORS headers so the embedded page can make XHR/fetch calls
        # back to this server from cross-origin parent pages.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")

        # Disable caching during development so reloads always show fresh content.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

        super().end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(204)
        self.end_headers()


def main():
    parser = argparse.ArgumentParser(
        description="HTTP server that allows iframe embedding from any origin."
    )
    parser.add_argument(
        "--port", "-p", type=int, default=8001,
        help="Port to listen on (default: 8000)",
    )
    parser.add_argument(
        "--host", default="0.0.0.0",
        help="Host/interface to bind (default: 0.0.0.0)",
    )
    parser.add_argument(
        "--directory", "-d", default=".",
        help="Directory to serve (default: current directory)",
    )
    args = parser.parse_args()

    handler = partial(IframeFriendlyHandler, directory=args.directory)
    server = HTTPServer((args.host, args.port), handler)

    print(f"Serving '{args.directory}' on http://{args.host}:{args.port}")
    print("Iframe embedding allowed from any origin.")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.server_close()


if __name__ == "__main__":
    main()