// Contrato público — Engine PJ
// Regra: só exporta o que é API. presumidoTable fica encapsulado.

export type { RentalPJInput } from "./types";
export { calculateRentalPJ } from "./calculate";
