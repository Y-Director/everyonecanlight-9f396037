// Free props unlock once a rental subtotal reaches this amount (naira).
export const PERK_THRESHOLD = 60000
export const qualifiesForPerks = (total: number) => Number(total ?? 0) >= PERK_THRESHOLD

// A Lighting Operator follows the gear only on rentals from this subtotal up.
export const OPERATOR_THRESHOLD = 100000
export const qualifiesForOperator = (total: number) => Number(total ?? 0) >= OPERATOR_THRESHOLD

// Number of props given out free once a rental qualifies for perks.
export const FREE_PROP_LIMIT = 3