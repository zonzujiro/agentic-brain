# Match persistence claims to the actual boundary

In this fictional example, a normal reopen preserved data, while clearing browser
storage removed it.[^observations] “Persists across reopening” is supported;
“cannot lose data” is not. A small local-only tool can fit a bounded need when its
limitations are visible and accepted. This example establishes no universal
storage recommendation and no frequency of data loss.

Apply the lesson when describing a persistence boundary: name the operation tested,
separate ordinary reopening from deletion/recovery, and check accepted user needs
before adding infrastructure. Shared access or recovery requirements require a
new comparison. Real projects must supply their own observations.

[^observations]: [First observation](source.md#first-observation) and
    [second observation](source.md#second-observation), both fictional.
