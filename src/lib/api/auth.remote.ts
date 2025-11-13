import { redirect } from "@sveltejs/kit";
import { APIError } from "better-auth";
import { form, getRequestEvent, query } from "$app/server";
import { auth } from "$lib/server/auth";
import { signupSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from "$lib/schema/auth";

export const signup = form(signupSchema, async (user) => {
  try {
		await auth.api.signUpEmail({ body: user });
	} catch (error) {
		return {
			error: error instanceof APIError ? error.body?.message : "Failed to sign up"
		};
	}

	redirect(307, "/");
});

export const login = form(loginSchema, async (user) => {
	try {
		const { request } = getRequestEvent();
		await auth.api.signInEmail({ body: user, headers: request.headers });
	} catch (error) {
		return {
			error: error instanceof APIError ? error.body?.message : "Invalid email or password"
		};
	}

	redirect(303, "/");
});

export const signout = form(async () => {
	try {
		const { request } = getRequestEvent();
		await auth.api.signOut({ headers: request.headers });
	} catch (error) {
		return {
			error: error instanceof APIError ? error.body?.message : "Failed to sign out"
		};
	}

	redirect(303, "/login");
});

export const resetPassword = form(resetPasswordSchema , async (data) => {
	try {
		const { request } = getRequestEvent();
		await auth.api.resetPassword({
			body: {
				newPassword: data.password,
				token: data.token
			},
			headers: request.headers
		});
	} catch (error) {
		return {
      error: error instanceof APIError ? error.body?.message : "Invalid or expired reset link"
    };
	}

	redirect(303, "/login");
});

export const forgotPassword = form(forgotPasswordSchema, async (data) => {
	try {
		await auth.api.forgetPassword({
			body: {
				email: data.email
			}
		});
		return {
			success: "Check your email! We've sent you a link to reset your password. It may take a few minutes to arrive."
		};
	} catch (error) {
		return {
			success: "Check your email! We've sent you a link to reset your password. It may take a few minutes to arrive."
		};
	}
});

export const getUser = query(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(307, "/login");
	}

	return locals.user;
});