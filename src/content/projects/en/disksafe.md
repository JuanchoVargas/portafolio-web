---
title: "disksafe"
tagline: "PowerShell tool that frees space on a Windows system drive without risking data"
kind: source
status: "Open source · v0.1.0"
order: 4
stack: ["PowerShell", "C# (P/Invoke)", "robocopy", "Pester"]
repo: "https://github.com/JuanchoVargas/disksafe"
gallery: []
highlights:
  - "Dry-run by default: nothing is deleted or moved until you pass -Execute"
  - "A folder's source is removed only after every file matches by SHA-256 at the destination"
  - "A single code path may delete and a single one may move, enforced by a static AST test"
  - "Fails closed: a path that cannot be resolved is treated as protected"
metrics:
  - value: "677"
    label: "passing tests"
  - value: "4"
    label: "commands"
  - value: "0"
    label: "external dependencies"
---

## The problem

When the system drive fills up, the usual fixes are cleanup scripts copied from a forum or deleting folders by hand. Both can break Windows or lose work. I wanted a tool for people who manage their own machine that shows exactly what it will touch before it touches anything.

## What I built

A PowerShell module with four commands. `scan` measures what takes up space and classifies each finding as safe to clean, movable, movable with a procedure, or do not touch. `advise` prints the native Windows commands worth running and their estimated gain, without running them. `clean` deletes old user temp files and browser, npm, pip and NuGet caches. `move` relocates repositories and data folders to another partition and keeps a journal so the operation can be undone.

It runs on Windows PowerShell 5.1 and PowerShell 7 with no external dependencies.

## Safety by design

A tool that deletes files has to fail toward the safe side. Protected paths live in one file, and validation resolves the real path through junctions, symlinks, short names and `..`, then repeats right before acting. Links are never followed. The copy never uses destructive robocopy options. Each operation writes its intent before acting and the result per item afterwards. The tool never elevates itself; it tells you which command needs an administrator.

A test parses the whole source tree and fails if any command that modifies the system appears outside the allowed files.

## Status

Version 0.1.0, MIT licensed. The suite passes on both PowerShell versions, working only on temporary folders. Running `clean` and `move` for real on a machine is still being validated, and the residual risks are documented in the repository.
