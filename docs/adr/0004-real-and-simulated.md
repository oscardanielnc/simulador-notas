# 0004 · Two layers per grade: real and simulated

Context: users mostly play with grades but must not lose the official ones.
Decision: each leaf stores `sim` and nullable `real`. The ★ badge is derived (`sim === real`), never stored. On start, real wins; leaves without real keep their last sim.
Rejected: a global "simulation mode" toggle (extra state, confusing); colored borders for real (Oscar rejected them visually).
