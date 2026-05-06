"""
CineDB — Movie Streaming DBMS Analyzer
Flask Backend: app.py
"""

from flask import Flask, request, jsonify, send_from_directory
from normalization import (
    parse_attributes,
    parse_fds,
    compute_closure,
    find_candidate_keys,
    find_partial_deps,
    find_transitive_deps,
    find_bcnf_violations,
    decompose_2nf,
    decompose_3nf,
    decompose_bcnf,
    sequential_decomp,
)
import os

app = Flask(__name__, static_folder='.', static_url_path='')


# ─── Serve Frontend ─────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


# ─── API: Analyze & Normalize ────────────────────────────────────────
@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    attr_str = data.get('attributes', '').strip()
    fd_str   = data.get('fds', '').strip()

    if not attr_str or not fd_str:
        return jsonify({'error': 'Attributes and FDs are required.'}), 400

    attrs = parse_attributes(attr_str)
    fds   = parse_fds(fd_str)

    if not fds:
        return jsonify({'error': 'No valid functional dependencies found.'}), 400

    candidate_keys    = find_candidate_keys(attrs, fds)
    partial_violations = find_partial_deps(attrs, fds, candidate_keys)
    transitive_violations = find_transitive_deps(attrs, fds, candidate_keys)
    bcnf_violations   = find_bcnf_violations(attrs, fds)

    highest_nf = (
        'BCNF' if not bcnf_violations else
        '3NF'  if not transitive_violations else
        '2NF'  if not partial_violations else
        '1NF'
    )

    decompositions = {
        '2NF':  decompose_2nf(attrs, fds, candidate_keys, partial_violations),
        '3NF':  decompose_3nf(attrs, fds, candidate_keys, transitive_violations),
        'BCNF': decompose_bcnf(attrs, fds, bcnf_violations),
        'sequential': sequential_decomp(attrs, fds),
    }

    def fd_to_dict(fd):
        return {'lhs': sorted(fd['lhs']), 'rhs': sorted(fd['rhs'])}

    def viol_to_dict(v):
        return {
            'fd': fd_to_dict(v['fd']),
            'detail': v.get('detail', '')
        }

    return jsonify({
        'attributes':    sorted(attrs),
        'fds':           [fd_to_dict(fd) for fd in fds],
        'candidate_keys': [sorted(k) for k in candidate_keys],
        'highest_nf':    highest_nf,
        'violations': {
            'partial':    [viol_to_dict(v) for v in partial_violations],
            'transitive': [viol_to_dict(v) for v in transitive_violations],
            'bcnf':       [{'fd': fd_to_dict(v)} for v in bcnf_violations],
        },
        'decompositions': decompositions,
        'summary': {
            'total_attributes': len(attrs),
            'total_fds': len(fds),
            'total_keys': len(candidate_keys),
            'total_violations': (
                len(partial_violations) +
                len(transitive_violations) +
                len(bcnf_violations)
            )
        }
    })


# ─── API: Compute Closure ────────────────────────────────────────────
@app.route('/api/closure', methods=['POST'])
def closure():
    data = request.get_json()
    attr_str    = data.get('attributes', '').strip()
    fd_str      = data.get('fds', '').strip()
    closure_str = data.get('x', '').strip()

    if not closure_str or not fd_str:
        return jsonify({'error': 'X and FDs are required.'}), 400

    attrs   = parse_attributes(attr_str)
    fds     = parse_fds(fd_str)
    x       = parse_attributes(closure_str)
    result  = compute_closure(x, fds)
    is_superkey = bool(attrs) and attrs.issubset(result)

    return jsonify({
        'x':          sorted(x),
        'closure':    sorted(result),
        'is_superkey': is_superkey
    })


# ─── API: Database Tables ────────────────────────────────────────────
@app.route('/api/tables/<table_name>', methods=['GET'])
def get_table(table_name):
    """Return table data as JSON."""
    from database import get_table_data
    data = get_table_data(table_name)
    if data is None:
        return jsonify({'error': 'Table not found'}), 404
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
