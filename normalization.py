"""
CineDB — Movie Streaming DBMS Analyzer
normalization.py — Core DBMS logic

Implements:
  - Attribute parsing
  - FD parsing
  - Attribute closure (Armstrong's axioms)
  - Candidate key detection
  - 1NF / 2NF / 3NF / BCNF violation detection
  - Decomposition helpers
"""

from itertools import chain, combinations


# ═══════════════════════════════════════════════
#  PARSING
# ═══════════════════════════════════════════════

def parse_attributes(attr_str: str) -> set:
    """
    Parse a comma-separated attribute string into a set.
    e.g. "MovieID, Title, Genre" → {'MovieID', 'Title', 'Genre'}
    """
    return {a.strip() for a in attr_str.split(',') if a.strip()}


def parse_fds(fd_text: str) -> list:
    """
    Parse multi-line FD text into a list of dicts.
    Each dict: { 'lhs': set, 'rhs': set }

    Accepts '→' or '->' as separator.
    e.g. "MovieID → Title, Genre" → [{'lhs': {'MovieID'}, 'rhs': {'Title','Genre'}}]
    """
    fds = []
    for line in fd_text.splitlines():
        line = line.strip()
        if not line:
            continue
        sep = '→' if '→' in line else ('->' if '->' in line else None)
        if sep is None:
            continue
        parts = line.split(sep, 1)
        if len(parts) != 2:
            continue
        lhs = parse_attributes(parts[0])
        rhs = parse_attributes(parts[1])
        if lhs and rhs:
            fds.append({'lhs': lhs, 'rhs': rhs})
    return fds


# ═══════════════════════════════════════════════
#  CLOSURE
# ═══════════════════════════════════════════════

def compute_closure(attr_set: set, fds: list) -> set:
    """
    Compute the attribute closure of attr_set under the given FDs.
    Uses a fixed-point iteration (Armstrong's axioms).
    """
    closure = set(attr_set)
    changed = True
    while changed:
        changed = False
        for fd in fds:
            if fd['lhs'].issubset(closure):
                before = len(closure)
                closure |= fd['rhs']
                if len(closure) > before:
                    changed = True
    return closure


# ═══════════════════════════════════════════════
#  POWER SET
# ═══════════════════════════════════════════════

def power_set(iterable):
    """Return all non-empty subsets, sorted by size (smallest first)."""
    s = list(iterable)
    return chain.from_iterable(combinations(s, r) for r in range(1, len(s) + 1))


# ═══════════════════════════════════════════════
#  CANDIDATE KEYS
# ═══════════════════════════════════════════════

def is_superkey(attr_set: set, all_attrs: set, fds: list) -> bool:
    """Check if attr_set is a superkey (closure covers all attributes)."""
    return compute_closure(attr_set, fds) >= all_attrs


def find_candidate_keys(all_attrs: set, fds: list) -> list:
    """
    Find all minimal superkeys (candidate keys).
    Returns a list of frozensets.
    """
    keys = []
    for subset in power_set(sorted(all_attrs)):
        subset_set = set(subset)
        # Skip if already a superset of an existing key
        if any(k.issubset(subset_set) for k in keys):
            continue
        if is_superkey(subset_set, all_attrs, fds):
            keys.append(frozenset(subset_set))
    return keys


# ═══════════════════════════════════════════════
#  PRIME & NON-PRIME ATTRIBUTES
# ═══════════════════════════════════════════════

def get_prime_attrs(candidate_keys: list) -> set:
    """Attributes that appear in at least one candidate key."""
    primes = set()
    for k in candidate_keys:
        primes |= k
    return primes


# ═══════════════════════════════════════════════
#  2NF — PARTIAL DEPENDENCY DETECTION
# ═══════════════════════════════════════════════

def find_partial_deps(all_attrs: set, fds: list, candidate_keys: list) -> list:
    """
    Detect partial dependencies (2NF violations).

    A partial dependency: X → Y where
    - X is a proper subset of some candidate key
    - Y contains at least one non-prime attribute
    """
    prime = get_prime_attrs(candidate_keys)
    violations = []
    seen = set()

    for fd in fds:
        lhs, rhs = fd['lhs'], fd['rhs']
        lhs_fs = frozenset(lhs)

        for key in candidate_keys:
            # lhs must be a proper subset of key
            if lhs_fs < key:
                non_prime_rhs = [a for a in rhs if a not in prime and a not in lhs]
                if non_prime_rhs:
                    sig = (lhs_fs, frozenset(non_prime_rhs))
                    if sig not in seen:
                        seen.add(sig)
                        violations.append({
                            'fd': fd,
                            'detail': (
                                f"{sorted(lhs)} → {sorted(non_prime_rhs)} is a partial dep "
                                f"(LHS ⊂ key {sorted(key)})"
                            ),
                            'nonPrimeRHS': non_prime_rhs
                        })
                    break

    return violations


# ═══════════════════════════════════════════════
#  3NF — TRANSITIVE DEPENDENCY DETECTION
# ═══════════════════════════════════════════════

def find_transitive_deps(all_attrs: set, fds: list, candidate_keys: list) -> list:
    """
    Detect transitive dependencies (3NF violations).

    A transitive dependency: X → Y where
    - X is not a superkey
    - X is not a subset of any candidate key (non-prime-only)
    - Y has at least one non-prime attribute not in X
    """
    prime = get_prime_attrs(candidate_keys)
    violations = []
    seen = set()

    for fd in fds:
        lhs, rhs = fd['lhs'], fd['rhs']
        lhs_fs = frozenset(lhs)

        # LHS must not be a superkey
        if is_superkey(lhs, all_attrs, fds):
            continue

        # LHS must NOT be entirely prime (avoid re-flagging prime-key subsets)
        if lhs.issubset(prime):
            continue

        non_prime_rhs = [a for a in rhs if a not in prime and a not in lhs]
        if non_prime_rhs:
            sig = (lhs_fs, frozenset(non_prime_rhs))
            if sig not in seen:
                seen.add(sig)
                violations.append({
                    'fd': fd,
                    'detail': (
                        f"{sorted(lhs)} → {sorted(non_prime_rhs)} is transitive "
                        f"(LHS not a superkey and not a key subset)"
                    ),
                    'nonPrimeRHS': non_prime_rhs
                })

    return violations


# ═══════════════════════════════════════════════
#  BCNF — VIOLATION DETECTION
# ═══════════════════════════════════════════════

def find_bcnf_violations(all_attrs: set, fds: list) -> list:
    """
    Detect BCNF violations.

    A BCNF violation: X → Y where X is not a superkey.
    """
    return [
        fd for fd in fds
        if not is_superkey(fd['lhs'], all_attrs, fds)
    ]


# ═══════════════════════════════════════════════
#  DECOMPOSITION HELPERS
# ═══════════════════════════════════════════════

def decompose_2nf(all_attrs: set, fds: list, candidate_keys: list, violations: list) -> dict:
    """
    Produce 2NF decomposition schema.
    For each partial dep X → Y, create relation R_i(X, Y).
    Remaining relation holds all prime attributes + non-deps.
    Returns dict with 'relations' list.
    """
    if not violations:
        return {'status': 'Already in 2NF', 'relations': [{'name': 'R', 'attributes': sorted(all_attrs)}]}

    relations = []
    covered = set()

    for i, v in enumerate(violations, start=1):
        lhs, rhs = v['fd']['lhs'], v['fd']['rhs']
        attrs = sorted(lhs | rhs)
        relations.append({
            'name': f'R{i}',
            'attributes': attrs,
            'fd': f"{sorted(lhs)} → {sorted(rhs)}",
            'role': 'Partial dep extracted'
        })
        covered |= rhs

    # Remaining relation: all_attrs minus removed non-prime attrs + all prime attrs
    prime = get_prime_attrs(candidate_keys)
    remaining = (all_attrs - covered) | prime
    if remaining:
        relations.append({
            'name': f'R{len(relations)+1}',
            'attributes': sorted(remaining),
            'role': 'Main relation (key + remaining attrs)'
        })

    return {'status': 'Decomposed to 2NF', 'relations': relations}


def decompose_3nf(all_attrs: set, fds: list, candidate_keys: list, violations: list) -> dict:
    """
    Produce 3NF decomposition schema.
    For each transitive dep X → Y, create relation R_i(X, Y).
    Returns dict with 'relations' list.
    """
    if not violations:
        return {'status': 'Already in 3NF', 'relations': [{'name': 'R', 'attributes': sorted(all_attrs)}]}

    relations = []
    covered = set()

    for i, v in enumerate(violations, start=1):
        lhs, rhs = v['fd']['lhs'], v['fd']['rhs']
        attrs = sorted(lhs | rhs)
        relations.append({
            'name': f'R{i}',
            'attributes': attrs,
            'fd': f"{sorted(lhs)} → {sorted(rhs)}",
            'role': 'Transitive dep extracted'
        })
        covered |= (rhs - lhs)

    remaining = all_attrs - covered
    if remaining:
        relations.append({
            'name': f'R{len(relations)+1}',
            'attributes': sorted(remaining),
            'role': 'Main relation (transitive attrs removed)'
        })

    return {'status': 'Decomposed to 3NF', 'relations': relations}


def decompose_bcnf(all_attrs: set, fds: list, violations: list) -> dict:
    """
    Produce BCNF decomposition schema.
    For each BCNF violation X → Y, create R1(X ∪ Y) and R2(all - Y + X).
    Returns dict with 'relations' list.
    Note: BCNF decomposition may not preserve all FDs.
    """
    if not violations:
        return {'status': 'Already in BCNF', 'relations': [{'name': 'R', 'attributes': sorted(all_attrs)}]}

    relations = []
    current = set(all_attrs)

    for i, fd in enumerate(violations, start=1):
        lhs, rhs = fd['lhs'], fd['rhs']
        # R1 = lhs ∪ rhs
        r1 = lhs | rhs
        # R2 = current - rhs + lhs
        r2 = (current - rhs) | lhs
        relations.append({
            'name': f'R{len(relations)+1}',
            'attributes': sorted(r1),
            'fd': f"{sorted(lhs)} → {sorted(rhs)}",
            'role': 'BCNF split: LHS ∪ RHS'
        })
        current = r2

    relations.append({
        'name': f'R{len(relations)+1}',
        'attributes': sorted(current),
        'role': 'BCNF split: remaining'
    })

    return {
        'status': 'Decomposed to BCNF',
        'relations': relations,
        'note': 'BCNF decomposition is lossless-join but may not preserve all FDs.'
    }


def get_relevant_fds(attrs: set, fds: list) -> list:
    """Return only FDs that are fully contained within the given attributes."""
    return [fd for fd in fds if fd['lhs'].issubset(attrs) and fd['rhs'].issubset(attrs)]


def sequential_decomp(all_attrs: set, fds: list) -> dict:
    """
    Perform step-by-step sequential decomposition:
    1NF → 2NF → 3NF → BCNF
    """
    # 1. Start with 1NF (Universal Relation)
    step1 = [{'name': 'R_1NF', 'attributes': all_attrs}]
    
    # 2. 1NF → 2NF
    candidate_keys = find_candidate_keys(all_attrs, fds)
    partial_violations = find_partial_deps(all_attrs, fds, candidate_keys)
    step2_res = decompose_2nf(all_attrs, fds, candidate_keys, partial_violations)
    step2 = step2_res['relations']
    
    # 3. 2NF → 3NF
    step3 = []
    for rel in step2:
        rel_attrs = set(rel['attributes'])
        rel_fds = get_relevant_fds(rel_attrs, fds)
        rel_keys = find_candidate_keys(rel_attrs, rel_fds)
        transitive_violations = find_transitive_deps(rel_attrs, rel_fds, rel_keys)
        
        if transitive_violations:
            decomp = decompose_3nf(rel_attrs, rel_fds, rel_keys, transitive_violations)
            for sub_rel in decomp['relations']:
                sub_rel['name'] = f"{rel['name']}_{sub_rel['name']}"
                step3.append(sub_rel)
        else:
            step3.append(rel)
            
    # 4. 3NF → BCNF
    step4 = []
    for rel in step3:
        rel_attrs = set(rel['attributes'])
        rel_fds = get_relevant_fds(rel_attrs, fds)
        bcnf_violations = find_bcnf_violations(rel_attrs, rel_fds)
        
        if bcnf_violations:
            decomp = decompose_bcnf(rel_attrs, rel_fds, bcnf_violations)
            for sub_rel in decomp['relations']:
                sub_rel['name'] = f"{rel['name']}_{sub_rel['name']}"
                step4.append(sub_rel)
        else:
            step4.append(rel)
            
    return {
        '1NF': step1,
        '2NF': step2,
        '3NF': step3,
        'BCNF': step4
    }
