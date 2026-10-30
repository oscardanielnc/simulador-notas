# F04 · Real vs simulated

All rules: [grading-rules.md](../grading-rules.md) § Real vs simulated, Editing a parent, Persistence.

UI

- ★ = solid star icon (vector, accent purple, ~14 dp) at the top-right corner of chips/cards that show their real grade. Never use ✨ sparkles: users read it as "AI".
- No border or color change for real vs simulated. Borders are only for selection.

Acceptance (become tests)

- The EX1/EX2 example in grading-rules.md passes step by step.
- Restart: leaf with real → shows real. Leaf without real → shows last sim.
