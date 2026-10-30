# 0008 · General average from complete courses only, rounded course grades

Context: home shows a credit-weighted general average. Courses fill up during the term, and simulated grades must never leak into it.
Options: (a) only complete courses · (b) each course from its real leaves, re-normalizing weights · (c) missing reals count as 0.
Decision (Oscar, 2026-10-30): (a). Each course enters with its real grade rounded to an integer (half up, like the official record), weighted by credits. The course picker of F01 is dropped: home always lists every template.
