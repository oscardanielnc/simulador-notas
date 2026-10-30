# 0009 · General average from day one; only real grades persist

Context: waiting for complete courses left the average empty most of the term (ADR 0008). Oscar wants to see it from the first day.
Decision (Oscar, 2026-10-30): every course counts with the grade on its card, rounded half up and weighted by credits. Only real grades are saved; on restart unmarked grades are 0. That makes the stored state equal to "what really happened", pushes the student to mark her real grades, and a notice on the course screen warns about it.
Consequence: during a session the average also reflects simulations; after a restart it is the real average with missing grades as 0.
