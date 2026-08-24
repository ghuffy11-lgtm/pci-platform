#!/usr/bin/env python3
"""
TASK-0043 -- bounded E4 observability evidence on a SECOND test subject.

Authority: MSG-0141 (AUTHORIZED), plus the CLAUDE-TASKS.md TASK-0043 section.
Binding:   EPA-0006 §4.6 S6 (E4's definition), S9 (verdict vocabulary), S10
           (engine-exposure), S11 (what a probe must not do); §4.12 gap 1 (the
           nonexistent-pragma CONTROL standard); §4.13 GAP-B / EV5; §4.14
           finding 8 (the second negative on the FIRST subject); §9.3 and
           ADR-0020 §6.2 (what "unauthorized passage text in the engine's own
           logs" means).

WHAT THIS IS
------------
The subject below is an EVIDENCE INSTRUMENT, not a candidate.  MSG-0141: this
is "not engine selection, adoption, deployment, or implementation
authorization".  A successful E4 observation CLEARS NOTHING and PREFERS
NOTHING.  No candidate verdict anywhere in EPA-0006 moves on this file's
output, whatever it says.

WHAT THIS IS NOT
----------------
Not a conformance probe.  It measures no U, exercises no S7 placement, ranks
nothing, times nothing, and compares no engines (MSG-0141 boundary 8; S11).
It touches no real corpus -- every fixture below is synthetic (S11).

THE STANDARD THIS FILE IS HELD TO
---------------------------------
§4.12's control is the reason this file is long.  SQLite silently ignores an
unrecognised pragma, so "PRAGMA vdbe_trace=on returned no error" is evidence of
NOTHING.  More generally: WITHOUT A CONTROL, "the instrument reported nothing"
AND "the instrument was never running" ARE THE SAME OBSERVATION.  Every
instrument armed below is therefore run twice -- once disarmed, once armed --
and the disarmed run must be silent before the armed run is believed.

HOW TO RUN
----------
    py  implementation/probes/TASK-0043/probe.py     (Windows launcher)
    python3 implementation/probes/TASK-0043/probe.py (elsewhere)

Deterministic, offline, no arguments, no network, no install.  Writes one
temporary database under the OS temp directory for section I and deletes it.
Nothing is written inside the repository; capture stdout to probe-output.txt.
"""

import os
import shutil
import sqlite3
import sys
import tempfile

# The marker that stands in for Restricted passage text.  Chosen so that a
# byte-scan for it cannot collide with anything else this process writes.
UNAUTH_MARKER = "ZZ-UNAUTHORIZED-PASSAGE-TEXT-ZZ"
AUTH_MARKER = "QQ-AUTHORIZED-PASSAGE-TEXT-QQ"

FAILURES = []


def head(title):
    print()
    print("=" * 78)
    print(title)
    print("=" * 78)


def note(k, v):
    print("  %-46s %s" % (k + ":", v))


def fail(msg):
    FAILURES.append(msg)
    print("  !! CONTROL FAILED: %s" % msg)


# ---------------------------------------------------------------------------
# A. Identification.  §4.14 finding 8 named its subject with versions so that a
#    later reader can tell whether a different answer means a changed engine or
#    a changed probe.  Acceptance criterion 1 requires the same here.
# ---------------------------------------------------------------------------

def section_a():
    head("A. SUBJECT AND RUNTIME IDENTIFICATION (acceptance criterion 1)")
    note("python sys.version", sys.version.replace("\n", " "))
    note("python sys.executable", sys.executable)
    note("sqlite3 module file", getattr(sqlite3, "__file__", "(builtin)"))
    note("sqlite3.sqlite_version  (the ENGINE)", sqlite3.sqlite_version)
    note("sqlite3.version  (the BINDING, deprecated)",
         getattr(sqlite3, "version", "(removed in this build)"))
    note("platform", sys.platform)
    print()
    print("  The FIRST subject, for contrast -- NOT re-run here (§4.14 finding 8):")
    print("    SQLite 3.51.3 via node:sqlite, Node v24.15.0 -- E4 NOT OBTAINABLE.")


# ---------------------------------------------------------------------------
# B. Surface enumeration.  §4.12 enumerated the prototypes of the first
#    subject rather than asserting anything about them.  Same method here.
#    S7.3: reachability is established by TAKING the placement, not by reading
#    documentation about it -- so this section only LISTS; sections F-H TAKE.
# ---------------------------------------------------------------------------

INTERESTING = ("trace", "profile", "log", "status", "scan", "authoriz",
               "progress", "hook", "callback", "debug")


def section_b(con):
    head("B. OBSERVABILITY SURFACE, ENUMERATED AT RUNTIME (criterion 2)")

    for label, obj in (("Connection", con), ("Cursor", con.cursor()),
                       ("sqlite3 module", sqlite3)):
        names = sorted(n for n in dir(obj) if not n.startswith("_"))
        hits = [n for n in names if any(t in n.lower() for t in INTERESTING)]
        print()
        note("%s -- total public names" % label, len(names))
        note("%s -- observability-related" % label,
             ", ".join(hits) if hits else "NONE")

    print()
    print("  Absent-by-enumeration, checked explicitly rather than assumed:")
    for n in ("set_trace_callback", "set_progress_handler", "set_authorizer",
              "stmt_scanstatus", "set_profile", "config_log", "trace_v2"):
        note("  Connection.%s" % n, "PRESENT" if hasattr(con, n) else "ABSENT")


# ---------------------------------------------------------------------------
# C. Compile options.  §4.12 checked exactly these three on the first subject
#    and found all three absent.  Checking them here is not re-enumerating that
#    subject -- it is the same question asked of a DIFFERENT build.
# ---------------------------------------------------------------------------

def section_c(con):
    head("C. BUILD COMPILE OPTIONS (criterion 2)")
    try:
        opts = [r[0] for r in con.execute("PRAGMA compile_options").fetchall()]
    except sqlite3.Error as e:
        note("PRAGMA compile_options", "ERROR: %r" % (e,))
        return []

    note("compile options reported", len(opts))
    for o in opts:
        print("      %s" % o)

    print()
    joined = " ".join(opts).upper()
    for flag in ("DEBUG", "ENABLE_SQLLOG", "ENABLE_STMT_SCANSTATUS"):
        note("  %s" % flag, "PRESENT" if flag in joined else "ABSENT")
    return opts


# ---------------------------------------------------------------------------
# D. Tracing pragmas against the NONEXISTENT-PRAGMA CONTROL.
#    This is §4.12's worked example and the reason its negative was believable.
#    A tracing pragma that behaves IDENTICALLY to a pragma that certainly does
#    not exist is INERT, whatever it returns.
# ---------------------------------------------------------------------------

CONTROL_PRAGMA = "pci_task_0043_pragma_that_certainly_does_not_exist"
TRACING_PRAGMAS = ("vdbe_trace", "vdbe_listing", "vdbe_addoptrace",
                   "parser_trace", "sql_trace")


def probe_pragma(con, name):
    """Return a behaviour signature: (raised?, error-or-None, rows)."""
    try:
        rows = con.execute("PRAGMA %s = 1" % name).fetchall()
        return (False, None, rows)
    except sqlite3.Error as e:
        return (True, "%s: %s" % (type(e).__name__, e), None)


def section_d(con):
    head("D. TRACING PRAGMAS vs THE NONEXISTENT-PRAGMA CONTROL (criterion 3)")
    print("  §4.12: SQLite silently ignores an unrecognised pragma, so 'no error'")
    print("  is evidence of nothing.  The control establishes what 'inert' LOOKS")
    print("  like on this build; anything matching it is inert.")
    print()

    control = probe_pragma(con, CONTROL_PRAGMA)
    note("CONTROL  PRAGMA %s" % CONTROL_PRAGMA, control)

    print()
    inert = []
    for p in TRACING_PRAGMAS:
        sig = probe_pragma(con, p)
        same = (sig == control)
        note("PRAGMA %s" % p,
             "%s   -> %s" % (sig, "IDENTICAL TO CONTROL => INERT" if same
                             else "DIFFERS FROM CONTROL => investigate"))
        if same:
            inert.append(p)

    print()
    note("tracing pragmas indistinguishable from the control",
         "%d of %d" % (len(inert), len(TRACING_PRAGMAS)))
    return len(inert) == len(TRACING_PRAGMAS)


# ---------------------------------------------------------------------------
# E. The fixture.  Synthetic (S11).  Deliberately small: this probe measures an
#    INSTRUMENT, not a candidate, so collection size carries no meaning here and
#    no count taken from it may be read as a U.
# ---------------------------------------------------------------------------

def build_fixture(con):
    con.execute("CREATE TABLE chunk ("
                "  id INTEGER PRIMARY KEY,"
                "  scope TEXT NOT NULL,"
                "  body  TEXT NOT NULL)")
    rows = []
    for i in range(1, 201):
        if i % 2 == 0:
            rows.append((i, "AUTHORIZED", "%s body %d" % (AUTH_MARKER, i)))
        else:
            rows.append((i, "OTHER-TENANT", "%s body %d" % (UNAUTH_MARKER, i)))
    con.executemany("INSERT INTO chunk VALUES (?,?,?)", rows)
    con.commit()
    return len(rows)


# The query examines every row and returns only the authorized ones -- so an
# instrument that reports "what was EXAMINED" and one that reports "what was
# RETURNED" must give different answers here.  That difference is the point.
SCAN_QUERY = "SELECT id FROM chunk WHERE scope = 'AUTHORIZED'"


# ---------------------------------------------------------------------------
# F. INSTRUMENT 1 -- set_trace_callback.  The candidate E4 surface.
#
#    Three questions, kept apart on purpose:
#      F1  does it emit anything at all, and is it silent when disarmed?
#          (the §4.12 control, transposed from pragmas to callbacks)
#      F2  can UNAUTHORIZED PASSAGE TEXT appear in what it emits?
#          (this is E4's literal question -- §4.6 S6, §9.3, ADR-0020 §6.2)
#      F3  does it record what the engine EXAMINED, or only what it was ASKED?
#          (the queue section's reading of E4 -- reported separately, never
#           merged into F2, because the two can disagree)
# ---------------------------------------------------------------------------

def section_f(con, nrows):
    head("F. INSTRUMENT 1 -- set_trace_callback (criteria 2, 3)")
    if not hasattr(con, "set_trace_callback"):
        note("set_trace_callback", "ABSENT -- instrument unavailable")
        return None

    captured = []

    # --- F1a  DISARMED run.  Must be silent.  If it is not, every later
    #          capture is suspect and the run is void.
    con.set_trace_callback(None)
    captured.clear()
    disarmed_rows = con.execute(SCAN_QUERY).fetchall()
    disarmed_captures = len(captured)
    note("F1a DISARMED -- rows returned", len(disarmed_rows))
    note("F1a DISARMED -- trace entries captured", disarmed_captures)
    if disarmed_captures != 0:
        fail("the disarmed trace captured %d entries; it should capture 0"
             % disarmed_captures)

    # --- F1b  ARMED run.  Must be non-silent.  A zero here would mean the
    #          instrument is inert, NOT that the engine emitted nothing.
    con.set_trace_callback(captured.append)
    armed_rows = con.execute(SCAN_QUERY).fetchall()
    armed_captures = len(captured)
    note("F1b ARMED -- rows returned", len(armed_rows))
    note("F1b ARMED -- trace entries captured", armed_captures)
    if armed_captures == 0:
        fail("the armed trace captured 0 entries -- instrument inert")

    print()
    print("  F1b VERBATIM, every entry emitted (criterion 3 requires the quote):")
    for i, s in enumerate(captured):
        print("      [%d] %r" % (i, s))

    # --- F1 verdict on the control
    control_ok = (disarmed_captures == 0 and armed_captures > 0)
    print()
    note("F1 CONTROL -- 'absent log' distinguished from 'never armed'",
         "YES -- silent disarmed, non-silent armed" if control_ok
         else "NO -- the control did not separate the two")

    # --- F2  Can unauthorized passage text reach this surface?
    #     Bound as a PARAMETER, because Python passes the EXPANDED sql when the
    #     engine can supply it -- which is exactly how passage text reaches a
    #     log that the application never wrote to.
    print()
    captured.clear()
    con.execute("SELECT id FROM chunk WHERE body = ?", (UNAUTH_MARKER + " body 7",)).fetchall()
    leaked = [s for s in captured if UNAUTH_MARKER in s]
    note("F2 trace entries from the parameterised query", len(captured))
    for i, s in enumerate(captured):
        print("      [%d] %r" % (i, s))
    note("F2 entries containing the UNAUTHORIZED marker", len(leaked))
    note("F2 => passage text CAN reach the engine's trace surface",
         "YES -- §9.3 / ADR-0020 §6.2 is engaged" if leaked
         else "NO -- parameters were not expanded into the trace")

    # --- F3  Examination vs instruction.  SCAN_QUERY examines every row in the
    #     table and returns half of them.  If the trace emits ONE entry for the
    #     whole statement, it records what the engine was ASKED, not what it
    #     TOUCHED -- and an E4 reading that demands the latter is not satisfied.
    print()
    captured.clear()
    con.execute(SCAN_QUERY).fetchall()
    note("F3 rows in the fixture", nrows)
    note("F3 rows the query must examine", nrows)
    note("F3 rows the query returns", nrows // 2)
    note("F3 trace entries emitted", len(captured))
    per_statement = (len(captured) <= 2)
    note("F3 => granularity",
         "PER STATEMENT -- records the instruction, NOT the examination"
         if per_statement else "finer than per-statement -- inspect above")

    con.set_trace_callback(None)
    return {"control_ok": control_ok,
            "armed_captures": armed_captures,
            "text_can_leak": bool(leaked),
            "per_statement": per_statement}


# ---------------------------------------------------------------------------
# G. INSTRUMENT 2 -- set_progress_handler.  Fires every N virtual-machine
#    instructions.  An execution-level signal, and deliberately reported as a
#    COUNTER rather than a log: it carries no content whatsoever, so it cannot
#    answer E4's question about passage text however often it fires.
# ---------------------------------------------------------------------------

def section_g(con):
    head("G. INSTRUMENT 2 -- set_progress_handler (criteria 2, 3)")
    if not hasattr(con, "set_progress_handler"):
        note("set_progress_handler", "ABSENT")
        return None

    box = {"n": 0}

    def handler():
        box["n"] += 1
        return 0

    con.set_progress_handler(None, 0)          # disarmed control
    box["n"] = 0
    con.execute(SCAN_QUERY).fetchall()
    disarmed = box["n"]
    note("DISARMED -- handler invocations", disarmed)
    if disarmed != 0:
        fail("the disarmed progress handler fired %d times" % disarmed)

    con.set_progress_handler(handler, 1)       # armed
    box["n"] = 0
    con.execute(SCAN_QUERY).fetchall()
    armed = box["n"]
    con.set_progress_handler(None, 0)
    note("ARMED (every 1 VM instruction) -- invocations", armed)
    if armed == 0:
        fail("the armed progress handler fired 0 times -- instrument inert")

    print()
    note("content carried per invocation", "NONE -- the callback takes no arguments")
    note("=> can this surface answer E4's passage-text question",
         "NO -- it is a counter, not a log")
    return {"disarmed": disarmed, "armed": armed}


# ---------------------------------------------------------------------------
# H. INSTRUMENT 3 -- set_authorizer.  Reports the OBJECTS a statement intends
#    to touch.  Recorded because it is the closest thing on this subject to
#    engine-side visibility -- and recorded with its limitation stated, because
#    it fires at PREPARE time, per column-reference, not per row examined.
# ---------------------------------------------------------------------------

def section_h(con):
    head("H. INSTRUMENT 3 -- set_authorizer (criteria 2, 3)")
    if not hasattr(con, "set_authorizer"):
        note("set_authorizer", "ABSENT")
        return None

    events = []

    def authorizer(action, arg1, arg2, dbname, trigger):
        events.append((action, arg1, arg2, dbname, trigger))
        return sqlite3.SQLITE_OK

    con.set_authorizer(None)                   # disarmed control
    events.clear()
    con.execute(SCAN_QUERY).fetchall()
    disarmed = len(events)
    note("DISARMED -- authorizer events", disarmed)
    if disarmed != 0:
        fail("the disarmed authorizer fired %d times" % disarmed)

    con.set_authorizer(authorizer)             # armed
    events.clear()
    con.execute(SCAN_QUERY).fetchall()
    armed = len(events)
    note("ARMED -- authorizer events", armed)
    if armed == 0:
        fail("the armed authorizer fired 0 times -- instrument inert")

    print()
    print("  VERBATIM (action, arg1, arg2, db, trigger):")
    for i, e in enumerate(events):
        print("      [%d] %r" % (i, e))

    # Re-running the SAME statement text tests whether these are prepare-time
    # events -- a cached statement should not re-authorize.
    events.clear()
    con.execute(SCAN_QUERY).fetchall()
    second = len(events)
    con.set_authorizer(None)

    print()
    note("events on an identical second execution", second)
    note("=> granularity",
         "PREPARE-TIME, per column reference -- NOT per row examined")
    note("=> can this surface answer E4's passage-text question",
         "NO -- it names objects, never content")
    return {"disarmed": disarmed, "armed": armed, "second": second}


# ---------------------------------------------------------------------------
# I. ENGINE-WRITTEN FILE ARTEFACTS -- the limb ':memory:' left open.
#    §4.12 and §4.14 finding 8 both recorded db.location() == null on the first
#    subject, i.e. "no file, so no journal, WAL or engine-written artefact to
#    read".  That is a limitation of the FIXTURE, not a property of the engine,
#    and it is cheap to close here.
#
#    Labelled precisely: a WAL is a DURABILITY artefact, not a log.  It is
#    reported as evidence about where passage text physically lands, and it is
#    NOT offered as E4 evidence.
# ---------------------------------------------------------------------------

def section_i():
    head("I. ENGINE-WRITTEN FILE ARTEFACTS (the ':memory:' limb, closed)")
    tmpdir = tempfile.mkdtemp(prefix="pci-task-0043-")
    dbpath = os.path.join(tmpdir, "probe.db")
    try:
        con = sqlite3.connect(dbpath)
        con.execute("PRAGMA journal_mode = WAL").fetchall()
        build_fixture(con)
        con.execute(SCAN_QUERY).fetchall()

        note("temporary database", dbpath)
        note("journal_mode", con.execute("PRAGMA journal_mode").fetchone()[0])

        needle = UNAUTH_MARKER.encode("utf-8")
        print()
        for suffix in ("", "-wal", "-journal", "-shm"):
            p = dbpath + suffix
            if not os.path.exists(p):
                note("artefact %-12s" % (suffix or "(main db)"), "ABSENT")
                continue
            with open(p, "rb") as fh:
                blob = fh.read()
            note("artefact %-12s" % (suffix or "(main db)"),
                 "%d bytes; UNAUTHORIZED marker %s"
                 % (len(blob),
                    "PRESENT %d time(s)" % blob.count(needle)
                    if needle in blob else "absent"))
        con.close()

        print()
        print("  STATED PRECISELY: these are DURABILITY artefacts, not logs.")
        print("  They are recorded because §4.12 could not check them, and they")
        print("  are NOT offered as E4 evidence -- E4 asks about the engine's")
        print("  own LOGS (§4.6 S6, §9.3), and a WAL is not one.")
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
        note("temporary directory removed", not os.path.exists(tmpdir))


# ---------------------------------------------------------------------------
# J. Verdict.  Two outcomes only, both from MSG-0141.  Computed from what was
#    observed above rather than narrated, so that a reader can disagree with the
#    reasoning without having to re-derive the observations.
# ---------------------------------------------------------------------------

def section_j(pragmas_inert, f, g, h):
    head("J. VERDICT (criteria 4, 5)")

    print("  E4, as EPA-0006 §4.6 S6 defines it:")
    print("    'Log inspection -- no unauthorized passage text in the engine's")
    print("     own logs (§9.3; ADR-0020 §6.2)'")
    print()
    print("  Three conditions, evaluated separately:")

    c1 = bool(f and f["armed_captures"] > 0)
    c2 = bool(f and f["control_ok"])
    c3 = bool(f and f["text_can_leak"])

    note("C1  an engine-emitted log surface exists and was TAKEN", c1)
    note("C2  a control separates 'absent log' from 'never armed'", c2)
    note("C3  the surface can be inspected FOR passage text", c3)

    print()
    print("  And, kept separate because the two readings can disagree:")
    note("C4  the surface records what the engine EXAMINED",
         "NO -- per-statement granularity" if (f and f["per_statement"])
         else "see section F3")

    print()
    if c1 and c2 and c3:
        print("  VERDICT: E4 is OBTAINABLE on this subject under §4.6 S6's")
        print("  definition -- an engine-emitted surface exists, it was armed and")
        print("  controlled, and it can be inspected for unauthorized passage text.")
        print()
        print("  AND IT IS OBTAINABLE IN THE ADVERSE DIRECTION.  What the")
        print("  inspection SHOWS is that passage text bound as a parameter DOES")
        print("  appear in the engine's own trace -- which is §9.3's finding")
        print("  demonstrated rather than argued.")
    else:
        print("  VERDICT: E4 is NOT OBTAINABLE within this bounded scope.")
        print("  The precise limitation is whichever of C1-C3 reads False above.")

    print()
    print("  WHAT THIS CLEARS: NOTHING.")
    print("  MSG-0141: a successful E4 observation 'does not clear any candidate")
    print("  or permit engine selection'.  No candidate in EPA-0006 is cleared,")
    print("  preferred, selected or ranked by this file.  All six candidates")
    print("  measured by TASK-0042 remain NOT CLEARED.  GAP-B is a statement")
    print("  about the FIRST subject and this file does not withdraw it.")

    print()
    if FAILURES:
        print("  RUN VALIDITY: VOID -- %d control(s) failed:" % len(FAILURES))
        for m in FAILURES:
            print("      - %s" % m)
    else:
        print("  RUN VALIDITY: VALID -- every negative control behaved as required")
        print("  (disarmed instruments silent, armed instruments not).")


def main():
    print("TASK-0043 -- bounded E4 observability evidence, SECOND test subject")
    print("MSG-0141 AUTHORIZED.  The subject is an INSTRUMENT, not a candidate.")
    print("This probe selects nothing, installs nothing, and clears nothing.")

    section_a()
    con = sqlite3.connect(":memory:")
    try:
        section_b(con)
        section_c(con)
        pragmas_inert = section_d(con)
        nrows = build_fixture(con)
        head("E. FIXTURE (synthetic -- S11)")
        note("rows", nrows)
        note("authorized / unauthorized", "%d / %d" % (nrows // 2, nrows // 2))
        note("query under trace", SCAN_QUERY)
        f = section_f(con, nrows)
        g = section_g(con)
        h = section_h(con)
    finally:
        con.close()
    section_i()
    section_j(pragmas_inert, f, g, h)
    print()
    print("END OF PROBE")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    sys.exit(main())
