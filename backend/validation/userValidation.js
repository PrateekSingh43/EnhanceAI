const z = require("zod");



const userValidationSchema = z.object({
	username: z.string().min(3).max(12),
	email: z.string().email(),
	age: z.number().min(14).max(100),
	password: z.string()
		.min(8)
		.max(16)
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
		)
});


module.exports = userValidationSchema; 