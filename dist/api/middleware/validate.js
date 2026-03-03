"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e) => ({
                campo: e.path.join("."),
                mensagem: e.message,
            }));
            return res.status(400).json({ error: "Dados inválidos.", detalhes: errors });
        }
        req.body = parsed.data;
        return next();
    };
}
