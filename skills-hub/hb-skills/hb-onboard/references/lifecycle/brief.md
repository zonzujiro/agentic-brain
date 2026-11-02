# Reading queue brief — fictional example

## Problem and outcome

Lee needs to retain unread links in one browser. Success is reopening a saved link
and distinguishing read from unread items; no usage metric has been measured.[^need]

## Scope and acceptance

Save a URL, list saved items, mark an item read and preserve both fields across a
normal reopen. Show a clear failure if storage rejects a write; never announce a
save that did not complete. Do not add accounts or cross-device sync without a
new scope choice. Clearing browser storage can erase the queue.[^limit]

## Open questions

Import/export and recovery after storage clearing remain outside the accepted
first version. This brief does not estimate demand for them.

[^need]: [First fictional observation](source.md#first-observation).
[^limit]: [Second fictional observation](source.md#second-observation).
