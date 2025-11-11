import * as v from "valibot"

export const signupSchema = v.object({
	name: v.pipe(
		v.string("Name must be a string"), 
		v.minLength(4, "Name must be at least 4 characters")
	),
	email: v.pipe(
		v.string("Email must be a string"), 
		v.email("Please enter a valid email address")
	),
	password: v.pipe(
		v.string("Password must be a string"), 
		v.minLength(8, "Password must be at least 8 characters")
	),
});

export const loginSchema = v.object({
	email: v.pipe(
		v.string("Email must be a string"), 
		v.email("Please enter a valid email address")
	),
	password: v.pipe(
		v.string("Password must be a string"), 
		v.minLength(8, "Password must be at least 8 characters")
	),
});

export const forgotPasswordSchema = v.object({
	email: v.pipe(
		v.string("Email must be a string"), 
		v.email("Invalid email address")
	)
});

export const resetPasswordSchema = v.pipe(
	v.object({
		token: v.pipe(
			v.string(),
			v.minLength(1, "Reset token is required")
		),
		password: v.pipe(
			v.string(),
			v.minLength(8, "Password must be at least 8 characters")
		),
		confirmPassword: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[["password"], ["confirmPassword"]],
			(input) => input.password === input.confirmPassword,
			"Passwords don't match"
		),
		["confirmPassword"]
	)
);